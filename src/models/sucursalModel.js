const db = require('../config/db');

class SucursalModel {
  static async listar() {
    const [rows] = await db.query('SELECT * FROM sucursal');
    return rows;
  }

  static async obtener(id) {
    const [rows] = await db.query('SELECT * FROM sucursal WHERE id_sucursal = ?', [id]);
    return rows[0];
  }

  static async obtenerInventario(idSucursal) {
    const [rows] = await db.query(
      `SELECT p.*, i.stock, i.ubicacion 
       FROM inventario_sucursal i
       JOIN Producto p ON i.id_producto = p.idProducto
       WHERE i.id_sucursal = ?`,
      [idSucursal]
    );
    return rows;
  }

  static async obtenerBodegas(idSucursal) {
    const [rows] = await db.query(
      'SELECT * FROM BODEGA WHERE id_sucursal = ?',
      [idSucursal]
    );
    return rows;
  }
}

module.exports = SucursalModel;