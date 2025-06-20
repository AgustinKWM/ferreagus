const db = require('../config/db');

class PromocionModel {
  static async listar() {
    const [rows] = await db.query('SELECT * FROM Promocion');
    return rows;
  }

  static async listarActivas() {
    const [rows] = await db.query(
      'SELECT * FROM Promocion WHERE fecha_inicio <= NOW() AND fecha_fin >= NOW()'
    );
    return rows;
  }

  static async obtenerPorCodigo(codigo) {
    const [rows] = await db.query(
      'SELECT * FROM Promocion WHERE codigo_promocion = ? AND fecha_inicio <= NOW() AND fecha_fin >= NOW()',
      [codigo]
    );
    return rows[0];
  }

  static async crear(promocion) {
    const [result] = await db.query(
      'INSERT INTO Promocion SET ?',
      [promocion]
    );
    return result.insertId;
  }

  static async actualizar(id, datos) {
    const [result] = await db.query(
      'UPDATE Promocion SET ? WHERE id_promocion = ?',
      [datos, id]
    );
    return result.affectedRows;
  }

  static async eliminar(id) {
    const [result] = await db.query(
      'DELETE FROM Promocion WHERE id_promocion = ?',
      [id]
    );
    return result.affectedRows;
  }
}

module.exports = PromocionModel;