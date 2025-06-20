const db = require('../config/db');

class CarritoModel {
  static async crear(idUsuario) {
    const [result] = await db.query(
      'INSERT INTO Carrito_compra (id_usuario, Fecha_creacion, Estado) VALUES (?, NOW(), "activo")',
      [idUsuario]
    );
    return result.insertId;
  }

  static async obtenerPorUsuario(idUsuario) {
    const [rows] = await db.query(
      `SELECT c.*, dc.idDetalle_carrito, dc.id_producto, p.nombre as producto_nombre, 
       dc.Cantidad, dc.Precio_unitario, p.Imagen
       FROM Carrito_compra c
       LEFT JOIN Detalle_carrito dc ON c.id_Carrito = dc.id_Carrito
       LEFT JOIN Producto p ON dc.id_producto = p.idProducto
       WHERE c.id_usuario = ? AND c.Estado = "activo"`,
      [idUsuario]
    );
    return rows;
  }

  static async agregarItem(idCarrito, idProducto, cantidad, precio) {
    const [result] = await db.query(
      `INSERT INTO Detalle_carrito (id_Carrito, id_producto, Cantidad, Precio_unitario)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE Cantidad = Cantidad + ?`,
      [idCarrito, idProducto, cantidad, precio, cantidad]
    );
    return result;
  }

  static async eliminarItem(idDetalle) {
    const [result] = await db.query(
      'DELETE FROM Detalle_carrito WHERE idDetalle_carrito = ?',
      [idDetalle]
    );
    return result.affectedRows;
  }

  static async actualizarCantidad(idDetalle, cantidad) {
    const [result] = await db.query(
      'UPDATE Detalle_carrito SET Cantidad = ? WHERE idDetalle_carrito = ?',
      [cantidad, idDetalle]
    );
    return result.affectedRows;
  }

  static async vaciar(idCarrito) {
    const [result] = await db.query(
      'DELETE FROM Detalle_carrito WHERE id_Carrito = ?',
      [idCarrito]
    );
    return result.affectedRows;
  }
}

module.exports = CarritoModel;