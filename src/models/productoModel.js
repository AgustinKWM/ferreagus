const db = require('../config/db');

class Producto {
  static async crear({ codigo_producto, nombre, descripcion, id_categoria, id_marca, precio, stock, imagen }) {
    const [result] = await db.query(
      `INSERT INTO Producto 
       (Codigo_producto, nombre, Descripcion, id_categoria, id_marca, Precio, Stock, Imagen, Fecha_ingreso) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [codigo_producto, nombre, descripcion, id_categoria, id_marca, precio, stock, imagen]
    );
    
    // Registrar precio inicial en historial
    await db.query(
      'INSERT INTO historial_precio (id_producto, fecha, valor) VALUES (?, NOW(), ?)',
      [result.insertId, precio]
    );
    
    return result.insertId;
  }

  static async obtenerTodos(filtros = {}) {
    let query = `SELECT p.*, c.nombre as categoria, m.nombre as marca 
                FROM Producto p
                JOIN categoria c ON p.id_categoria = c.id_categoria
                JOIN marca m ON p.id_marca = m.id_marca`;
    
    const params = [];
    
    // Filtros opcionales
    if (filtros.categoria) {
      query += ' WHERE p.id_categoria = ?';
      params.push(filtros.categoria);
    }
    
    if (filtros.marca) {
      query += params.length ? ' AND' : ' WHERE';
      query += ' p.id_marca = ?';
      params.push(filtros.marca);
    }
    
    if (filtros.stockMin) {
      query += params.length ? ' AND' : ' WHERE';
      query += ' p.Stock >= ?';
      params.push(filtros.stockMin);
    }
    
    query += ' ORDER BY p.nombre';
    
    const [rows] = await db.query(query, params);
    return rows;
  }

  static async obtenerPorId(id) {
    const [rows] = await db.query(
      `SELECT p.*, c.nombre as categoria, m.nombre as marca, 
       (SELECT valor FROM historial_precio hp 
        WHERE hp.id_producto = p.idProducto 
        ORDER BY fecha DESC LIMIT 1) as precio_actual
       FROM Producto p
       JOIN categoria c ON p.id_categoria = c.id_categoria
       JOIN marca m ON p.id_marca = m.id_marca
       WHERE p.idProducto = ?`, 
      [id]
    );
    return rows[0];
  }

  static async actualizar(id, datos) {
    // Si se actualiza el precio, registrar en historial
    if (datos.Precio) {
      const [producto] = await db.query(
        'SELECT Precio FROM Producto WHERE idProducto = ?',
        [id]
      );
      
      if (producto.length && producto[0].Precio !== datos.Precio) {
        await db.query(
          'INSERT INTO historial_precio (id_producto, fecha, valor) VALUES (?, NOW(), ?)',
          [id, datos.Precio]
        );
      }
    }
    
    const [result] = await db.query(
      'UPDATE Producto SET ? WHERE idProducto = ?',
      [datos, id]
    );
    return result.affectedRows;
  }

  static async eliminar(id) {
    const [result] = await db.query(
      'DELETE FROM Producto WHERE idProducto = ?',
      [id]
    );
    return result.affectedRows;
  }

  static async actualizarStock(id, cantidad) {
    const [result] = await db.query(
      'UPDATE Producto SET Stock = Stock + ? WHERE idProducto = ?',
      [cantidad, id]
    );
    
    if (result.affectedRows) {
      await db.query(
        'UPDATE inventario_sucursal SET stock = stock + ? WHERE id_producto = ?',
        [cantidad, id]
      );
    }
    
    return result.affectedRows;
  }

  static async obtenerDisponibilidad(idProducto, idSucursal) {
    const [rows] = await db.query(
      `SELECT p.*, i.stock as stock_sucursal, i.ubicacion
       FROM Producto p
       LEFT JOIN inventario_sucursal i ON p.idProducto = i.id_producto AND i.id_sucursal = ?
       WHERE p.idProducto = ?`,
      [idSucursal, idProducto]
    );
    return rows[0];
  }

  static async obtenerHistorialPrecios(idProducto) {
    const [rows] = await db.query(
      'SELECT * FROM historial_precio WHERE id_producto = ? ORDER BY fecha DESC',
      [idProducto]
    );
    return rows;
  }
}

module.exports = Producto;