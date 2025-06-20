const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const usuarioController = {
  registrar: async (req, res) => {
    try {
      const { username, email, clave, nombre_apellido, direccion, telefono } = req.body;
      
      if (!email || !clave) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
      }

      const usuarioExistente = await Usuario.obtenerPorEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(clave, salt);

      const idUsuario = await Usuario.crear({
        username,
        email,
        clave: hashedPassword,
        id_tipo_usuario: 3 // Cliente por defecto
      });

      res.status(201).json({ 
        mensaje: 'Usuario registrado exitosamente',
        idUsuario 
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, clave } = req.body;
      
      if (!email || !clave) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
      }

      const usuario = await Usuario.obtenerPorEmail(email);
      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const esValida = await bcrypt.compare(clave, usuario.Clave);
      if (!esValida) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const token = jwt.sign(
        { 
          id: usuario.idUsuario, 
          tipo: usuario.id_tipo_usuario,
          username: usuario.Username
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ 
        token,
        idUsuario: usuario.idUsuario,
        tipoUsuario: usuario.id_tipo_usuario,
        username: usuario.Username
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  },

  obtenerPerfil: async (req, res) => {
    try {
      const usuario = await Usuario.obtenerPerfil(req.user.id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(usuario);
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({ error: 'Error al obtener perfil' });
    }
  },

  // ADMIN: Gestión de trabajadores
  crearTrabajador: async (req, res) => {
    try {
      const { username, email, clave } = req.body;
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(clave, salt);

      const idUsuario = await Usuario.crear({
        username,
        email,
        clave: hashedPassword,
        id_tipo_usuario: 2 // Fuerza a ser trabajador
      });

      res.status(201).json({ 
        mensaje: 'Trabajador creado exitosamente',
        idUsuario 
      });
    } catch (error) {
      console.error('Error al crear trabajador:', error);
      res.status(500).json({ error: 'Error al crear trabajador' });
    }
  },

  listarTrabajadores: async (req, res) => {
    try {
      const trabajadores = await Usuario.listarTrabajadores();
      res.json(trabajadores);
    } catch (error) {
      console.error('Error al listar trabajadores:', error);
      res.status(500).json({ error: 'Error al listar trabajadores' });
    }
  },

  actualizarTrabajador: async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email } = req.body;

      await Usuario.actualizar(id, { username, email });
      res.json({ mensaje: 'Trabajador actualizado' });
    } catch (error) {
      console.error('Error al actualizar trabajador:', error);
      res.status(500).json({ error: 'Error al actualizar trabajador' });
    }
  },

  eliminarTrabajador: async (req, res) => {
    try {
      const { id } = req.params;
      await Usuario.eliminar(id);
      res.json({ mensaje: 'Trabajador eliminado' });
    } catch (error) {
      console.error('Error al eliminar trabajador:', error);
      res.status(500).json({ error: 'Error al eliminar trabajador' });
    }
  },

  // CLIENTE: Auto-gestión
  actualizarPerfil: async (req, res) => {
    try {
      const { username, clave, nombre_apellido, direccion, telefono } = req.body;
      const datosActualizar = { username };

      if (clave) {
        const salt = await bcrypt.genSalt(10);
        datosActualizar.clave = await bcrypt.hash(clave, salt);
      }

      await Usuario.actualizar(req.user.id, datosActualizar);
      res.json({ mensaje: 'Perfil actualizado' });
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      res.status(500).json({ error: 'Error al actualizar perfil' });
    }
  },

  eliminarCuenta: async (req, res) => {
    try {
      await Usuario.eliminar(req.user.id);
      res.json({ mensaje: 'Cuenta eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      res.status(500).json({ error: 'Error al eliminar cuenta' });
    }
  }
};

module.exports = usuarioController;