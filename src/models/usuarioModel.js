const db = require('../config/db');

class Usuario {
  static async crear({ username, email, clave, id_tipo_usuario }) {
    const [result] = await db.query(
      'INSERT INTO Usuario (Username, Email, Clave, id_tipo_usuario) VALUES (?, ?, ?, ?)',
      [username, email, clave, id_tipo_usuario]
    );
    return result.insertId;
  }

  static async obtenerPorEmail(email) {
    const [rows] = await db.query(
      'SELECT * FROM Usuario WHERE Email = ?', 
      [email]
    );
    return rows[0];
  }

  static async obtenerPerfil(idUsuario) {
    const [rows] = await db.query(
      `SELECT u.idUsuario, u.Username, u.Email, p.Nombre_apellido, p.Direccion, p.Telefono 
       FROM Usuario u
       LEFT JOIN Perfil_usuario p ON u.idUsuario = p.id_usuario
       WHERE u.idUsuario = ?`,
      [idUsuario]
    );
    return rows[0];
  }

  static async actualizar(idUsuario, datos) {
    const [result] = await db.query(
      'UPDATE Usuario SET ? WHERE idUsuario = ?',
      [datos, idUsuario]
    );
    return result.affectedRows;
  }

  static async eliminar(idUsuario) {
    const [result] = await db.query(
      'DELETE FROM Usuario WHERE idUsuario = ?',
      [idUsuario]
    );
    return result.affectedRows;
  }

  static async listarTrabajadores() {
    const [rows] = await db.query(
      'SELECT idUsuario, Username, Email FROM Usuario WHERE id_tipo_usuario = 2'
    );
    return rows;
  }
}

module.exports = Usuario;