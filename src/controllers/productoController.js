const Producto = require('../models/productoModel');

const productoController = {
  crearProducto: async (req, res) => {
    try {
      const { 
        codigo_producto, 
        nombre, 
        descripcion, 
        id_categoria, 
        id_marca, 
        precio, 
        stock,
        imagen 
      } = req.body;

      // Validación mejorada y estricta
      const precioNum = parseFloat(precio);
      const stockNum = parseInt(stock);

      if (
        !nombre || 
        !id_categoria || 
        !id_marca || 
        isNaN(precioNum) || precioNum <= 0 || 
        isNaN(stockNum) || stockNum < 0
      ) {
        return res.status(400).json({ 
          error: 'Nombre, categoría, marca son requeridos. Precio debe ser número > 0 y stock número >= 0.'
        });
      }

      const idProducto = await Producto.crear({
        codigo_producto: codigo_producto || `PROD-${Date.now()}`,
        nombre,
        descripcion,
        id_categoria,
        id_marca,
        precio: precioNum,
        stock: stockNum,
        imagen: imagen || 'default-product.jpg'
      });

      res.status(201).json({ 
        mensaje: 'Producto creado exitosamente',
        idProducto,
        precio: precioNum,
        stock: stockNum
      });
    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).json({ 
        error: 'Error al crear producto',
        detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  listarProductos: async (req, res) => {
    try {
      const { categoria, marca, stockMin } = req.query;
      const productos = await Producto.obtenerTodos({ 
        categoria, 
        marca, 
        stockMin 
      });
      res.json(productos);
    } catch (error) {
      console.error('Error al listar productos:', error);
      res.status(500).json({ 
        error: 'Error al listar productos',
        detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  obtenerProducto: async (req, res) => {
    try {
      const producto = await Producto.obtenerPorId(req.params.id);
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
      // Obtener historial de precios si se solicita
      if (req.query.historial === 'true') {
        producto.historial_precios = await Producto.obtenerHistorialPrecios(req.params.id);
      }
      
      res.json(producto);
    } catch (error) {
      console.error('Error al obtener producto:', error);
      res.status(500).json({ 
        error: 'Error al obtener producto',
        detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  actualizarProducto: async (req, res) => {
    try {
      const { id } = req.params;
      const datosActualizados = { ...req.body };

      // Validar precio si viene
      if (datosActualizados.precio !== undefined) {
        const precioNum = parseFloat(datosActualizados.precio);
        if (isNaN(precioNum) || precioNum <= 0) {
          return res.status(400).json({ error: 'Precio debe ser un número válido mayor que 0' });
        }
        datosActualizados.precio = precioNum;
      }

      // Validar stock si viene
      if (datosActualizados.stock !== undefined) {
        const stockNum = parseInt(datosActualizados.stock);
        if (isNaN(stockNum) || stockNum < 0) {
          return res.status(400).json({ error: 'Stock debe ser un número válido mayor o igual a 0' });
        }
        datosActualizados.stock = stockNum;
      }

      const actualizado = await Producto.actualizar(id, datosActualizados);
      if (!actualizado) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.json({ 
        mensaje: 'Producto actualizado',
        cambios: datosActualizados
      });
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({ 
        error: 'Error al actualizar producto',
        detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  eliminarProducto: async (req, res) => {
    try {
      const { id } = req.params;
      const eliminado = await Producto.eliminar(id);
      
      if (!eliminado) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.json({ mensaje: 'Producto eliminado' });
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      
      // Manejar error de FK constraint
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ 
          error: 'No se puede eliminar, el producto está asociado a ventas o inventario'
        });
      }
      
      res.status(500).json({ 
        error: 'Error al eliminar producto',
        detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  actualizarStock: async (req, res) => {
    try {
      const { id } = req.params;
      const { cantidad, idSucursal } = req.body;

      if (isNaN(cantidad)) {
        return res.status(400).json({ error: 'Cantidad debe ser un número válido' });
      }

      const actualizado = await Producto.actualizarStock(id, cantidad);
      if (!actualizado) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      const response = { mensaje: 'Stock actualizado', cantidad };

      if (idSucursal) {
        const inventario = await Producto.obtenerDisponibilidad(id, idSucursal);
        response.stock_sucursal = inventario.stock_sucursal;
      }

      res.json(response);
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      res.status(500).json({ 
        error: 'Error al actualizar stock',
        detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  obtenerDisponibilidad: async (req, res) => {
    try {
      const { id } = req.params;
      const { sucursal } = req.query;
      
      if (!sucursal) {
        return res.status(400).json({ error: 'ID de sucursal requerido' });
      }

      const producto = await Producto.obtenerDisponibilidad(id, sucursal);
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado en la sucursal especificada' });
      }

      res.json(producto);
    } catch (error) {
      console.error('Error al obtener disponibilidad:', error);
      res.status(500).json({ 
        error: 'Error al obtener disponibilidad',
        detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = productoController;
