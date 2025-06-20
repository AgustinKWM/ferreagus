const db = require('../config/db');

class VentaModel {
  static async crear(ventaData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Crear la venta
      const [ventaResult] = await connection.query(
        'INSERT INTO VENTA SET ?',
        [{
          precio_total: ventaData.precioTotal,
          fecha_compra: new Date(),
          codigo_boleta: `BOL-${Date.now()}`,
          nombre_sucursal: ventaData.sucursal,
          idDetalle_carrito: ventaData.idDetalleCarrito,
          id_usuario: ventaData.idUsuario,
          estado: 'pendiente'
        }]
      );

      // 2. Actualizar estado del carrito
      await connection.query(
        'UPDATE Carrito_compra SET Estado = "finalizado" WHERE id_Carrito = ?',
        [ventaData.idCarrito]
      );

      // 3. Actualizar inventario
      for (const item of ventaData.items) {
        await connection.query(
          `UPDATE inventario_sucursal 
           SET stock = stock - ? 
           WHERE id_sucursal = ? AND id_producto = ?`,
          [item.cantidad, ventaData.idSucursal, item.idProducto]
        );
      }

      await connection.commit();
      return ventaResult.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async obtenerPorUsuario(idUsuario) {
    const [rows] = await db.query(
      `SELECT v.*, d.estado as estado_despacho
       FROM VENTA v
       LEFT JOIN DESPACHO d ON v.id_venta = d.Codigo_venta
       WHERE v.id_usuario = ?`,
      [idUsuario]
    );
    return rows;
  }

  static async obtener(idVenta) {
    const [rows] = await db.query(
      `SELECT v.*, 
       JSON_ARRAYAGG(
         JSON_OBJECT(
           'producto', p.nombre,
           'cantidad', dc.Cantidad,
           'precio', dc.Precio_unitario,
           'imagen', p.Imagen
         )
       ) as items
       FROM VENTA v
       JOIN Detalle_carrito dc ON v.idDetalle_carrito = dc.idDetalle_carrito
       JOIN Producto p ON dc.id_producto = p.idProducto
       WHERE v.id_venta = ?`,
      [idVenta]
    );
    return rows[0];
  }

  static async crearDespacho(despachoData) {
    const [result] = await db.query(
      'INSERT INTO DESPACHO SET ?',
      [{
        ...despachoData,
        estado: 'preparacion'
      }]
    );
    return result.insertId;
  }

  static async obtenerDespacho(idVenta) {
    const [rows] = await db.query(
      'SELECT * FROM DESPACHO WHERE Codigo_venta = ?',
      [idVenta]
    );
    return rows[0];
  }

  static async actualizarEstado(idVenta, estado) {
    const [result] = await db.query(
      'UPDATE VENTA SET estado = ? WHERE id_venta = ?',
      [estado, idVenta]
    );
    return result.affectedRows;
  }
}

module.exports = VentaModel;