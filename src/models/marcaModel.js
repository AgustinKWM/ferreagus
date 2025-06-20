const db = require('../config/db');

class Marca {
  static async crear({ nombre, descripcion, logo, logo_path }) {
    const [result] = await db.query(
      'INSERT INTO marca (nombre, descripcion, logo, logo_path) VALUES (?, ?, ?, ?)',
      [nombre, descripcion, logo, logo_path]
    );
    return result.insertId;
  }

  static async obtenerTodas() {
    const [rows] = await db.query(
      'SELECT id_marca, nombre, descripcion, logo, logo_path FROM marca ORDER BY nombre ASC'
    );
    return rows;
  }

  static async obtenerPorId(id) {
    const [rows] = await db.query(
      'SELECT id_marca, nombre, descripcion, logo, logo_path FROM marca WHERE id_marca = ?',
      [id]
    );
    return rows[0];
  }

  static async actualizar(id, { nombre, descripcion, logo, logo_path }) {
    const [result] = await db.query(
      'UPDATE marca SET nombre = ?, descripcion = ?, logo = ?, logo_path = ? WHERE id_marca = ?',
      [nombre, descripcion, logo, logo_path, id]
    );
    return result.affectedRows;
  }

  static async eliminar(id) {
    const [result] = await db.query(
      'DELETE FROM marca WHERE id_marca = ?',
      [id]
    );
    return result.affectedRows;
  }

  static async buscarPorNombre(nombre) {
    const [rows] = await db.query(
      'SELECT id_marca, nombre FROM marca WHERE LOWER(nombre) = ?',
      [nombre.toLowerCase()]
    );
    return rows[0];
  }
}

module.exports = Marca;