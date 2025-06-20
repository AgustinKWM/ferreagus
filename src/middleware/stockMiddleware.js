const verificarStock = async (req, res, next) => {
  const { items, idSucursal } = req.body;
  
  try {
    const connection = await db.getConnection();
    const verificaciones = items.map(async item => {
      const [stock] = await connection.query(
        'SELECT stock FROM inventario_sucursal WHERE id_sucursal = ? AND id_producto = ?',
        [idSucursal, item.idProducto]
      );
      
      if (stock.length === 0 || stock[0].stock < item.cantidad) {
        throw new Error(`Stock insuficiente para el producto ID: ${item.idProducto}`);
      }
    });

    await Promise.all(verificaciones);
    connection.release();
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { verificarStock };