const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { generateToken } = require('../utils/authUtils');

// Configuración de roles
const ROLES = {
  ADMIN: 1,
  EMPLOYEE: 2,
  CLIENT: 3
};

const authController = {
  register: async (req, res, next) => {
    const connection = await pool.getConnection();
    try {
      const { username, email, password } = req.body;

      const errors = {};
      if (!username) errors.username = 'Nombre de usuario requerido';
      if (!email) errors.email = 'Email requerido';
      if (!password) errors.password = 'Contraseña requerida';
      
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ 
          success: false,
          error: 'Todos los campos son requeridos',
          details: errors
        });
      }

      const [existingUser] = await connection.query(
        'SELECT idUsuario, email, username FROM Usuario WHERE email = ? OR username = ? LIMIT 1', 
        [email, username]
      );
      
      if (existingUser.length > 0) {
        const details = {};
        if (existingUser[0].email === email) details.email = 'Email ya registrado';
        if (existingUser[0].username === username) details.username = 'Nombre de usuario en uso';
        
        return res.status(409).json({ 
          success: false,
          error: 'El usuario ya existe',
          details
        });
      }

      await connection.beginTransaction();

      const hashedPassword = await bcrypt.hash(password, 12);
      const [userResult] = await connection.query(
        'INSERT INTO Usuario (username, email, Clave, id_tipo_usuario) VALUES (?, ?, ?, ?)',
        [username, email.toLowerCase(), hashedPassword, ROLES.CLIENT]
      );

      await connection.query(
        'INSERT INTO Perfil_usuario (id_usuario) VALUES (?)',
        [userResult.insertId]
      );

      await connection.commit();

      const token = generateToken({
        id: userResult.insertId,
        username,
        role: ROLES.CLIENT,
        email
      });

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        token,
        user: {
          id: userResult.insertId,
          username,
          email,
          role: ROLES.CLIENT
        }
      });

    } catch (error) {
      await connection.rollback();
      console.error('Error en registro:', error);
      next(error);
    } finally {
      connection.release();
    }
  },

  login: async (req, res, next) => {
    try {
      let { email, password } = req.body;
      email = email.toLowerCase().trim();

      if (!email || !password) {
        return res.status(400).json({ 
          success: false,
          error: 'Email y contraseña son requeridos'
        });
      }

      const [users] = await pool.query(
        `SELECT u.idUsuario, u.Username, u.Email, u.Clave, u.id_tipo_usuario, t.Tipo_usuario as nombre_rol 
         FROM Usuario u
         JOIN Tipo_usuario t ON u.id_tipo_usuario = t.id_Tipo_usuario
         WHERE u.email = ? LIMIT 1`, 
        [email]
      );
      
      if (users.length === 0) {
        return res.status(401).json({ 
          success: false,
          error: 'Credenciales inválidas'
        });
      }

      const user = users[0];
      const isValidPassword = await bcrypt.compare(password, user.Clave);

      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false,
          error: 'Credenciales inválidas'
        });
      }

      const token = generateToken({
        id: user.idUsuario,
        username: user.Username,
        email: user.Email,
        role: user.id_tipo_usuario
      });

      // Añadir redirección para admin
      const response = {
        success: true,
        message: 'Inicio de sesión exitoso',
        token,
        user: {
          id: user.idUsuario,
          username: user.Username,
          email: user.Email,
          role: user.id_tipo_usuario,
          roleName: user.nombre_rol
        }
      };

      // Solo añadir redirectTo si es admin
      if (user.id_tipo_usuario === ROLES.ADMIN) {
        response.redirectTo = '/admin/user-management';
      }

      res.json(response);

    } catch (error) {
      console.error('Error en login:', error);
      next(error);
    }
  },

  verifyToken: async (req, res, next) => {
    try {
      const [user] = await pool.query(
        `SELECT u.idUsuario, u.Username, u.Email, u.id_tipo_usuario, t.Tipo_usuario as nombre_rol
         FROM Usuario u
         JOIN Tipo_usuario t ON u.id_tipo_usuario = t.id_Tipo_usuario
         WHERE u.idUsuario = ? LIMIT 1`, 
        [req.user.id]
      );

      if (user.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      const [profile] = await pool.query(
        'SELECT Nombre_apellido, Telefono, Direccion FROM Perfil_usuario WHERE id_usuario = ?',
        [req.user.id]
      );

      const response = {
        success: true,
        isValid: true,
        user: {
          ...user[0],
          profile: profile[0] || null
        }
      };

      // Añadir redirección si es admin y no está en ruta admin
      if (user[0].id_tipo_usuario === ROLES.ADMIN && !req.originalUrl.startsWith('/admin')) {
        response.redirectTo = '/admin/user-management';
        response.message = 'Redirigiendo a panel de administración';
      }

      res.json(response);
    } catch (error) {
      console.error('Error al verificar token:', error);
      next(error);
    }
  },

  getCurrentUser: async (req, res, next) => {
    try {
      const [user] = await pool.query(
        `SELECT u.idUsuario, u.Username, u.Email, u.id_tipo_usuario, t.Tipo_usuario as nombre_rol, p.Nombre_apellido, p.Telefono, p.Direccion
         FROM Usuario u
         JOIN Tipo_usuario t ON u.id_tipo_usuario = t.id_Tipo_usuario
         LEFT JOIN Perfil_usuario p ON u.idUsuario = p.id_usuario
         WHERE u.idUsuario = ? LIMIT 1`, 
        [req.user.id]
      );

      if (user.length === 0) {
        return res.status(404).json({ 
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        user: user[0]
      });
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      next(error);
    }
  },

  createAdmin: async (req, res, next) => {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({ 
        success: false,
        error: 'Acceso prohibido en producción' 
      });
    }

    const connection = await pool.getConnection();
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ 
          success: false,
          error: 'Todos los campos son requeridos'
        });
      }

      await connection.beginTransaction();
      const hashedPassword = await bcrypt.hash(password, 12);
      const [userResult] = await connection.query(
        'INSERT INTO Usuario (username, email, Clave, id_tipo_usuario) VALUES (?, ?, ?, ?)',
        [username, email.toLowerCase(), hashedPassword, ROLES.ADMIN]
      );

      await connection.query(
        'INSERT INTO Perfil_usuario (id_usuario) VALUES (?)',
        [userResult.insertId]
      );

      await connection.commit();

      res.status(201).json({
        success: true,
        message: 'Usuario admin creado exitosamente',
        userId: userResult.insertId
      });

    } catch (error) {
      await connection.rollback();
      console.error('Error al crear admin:', error);
      next(error);
    } finally {
      connection.release();
    }
  }
};

module.exports = authController;