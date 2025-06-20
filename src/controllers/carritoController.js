const CarritoModel = require('../models/carritoModel');
const ProductoModel = require('../models/productoModel');

class CarritoController {
    async crearCarrito(req, res) {
        try {
            const idUsuario = req.user.id;
            const idCarrito = await CarritoModel.crear(idUsuario);
            res.status(201).json({ idCarrito });
        } catch (error) {
            res.status(500).json({ error: 'Error al crear carrito' });
        }
    }

    async obtenerCarritoPorUsuario(req, res) {
        try {
            const idUsuario = req.params.id;
            const carrito = await CarritoModel.obtenerPorUsuario(idUsuario);
            
            if (!carrito || carrito.length === 0) {
                return res.status(404).json({ mensaje: 'Carrito no encontrado' });
            }

            // Calcular total
            const total = carrito.reduce((sum, item) => {
                return sum + (item.Precio_unitario * item.Cantidad);
            }, 0);

            res.json({ items: carrito, total });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener carrito' });
        }
    }

    async agregarItem(req, res) {
        try {
            const { idProducto, cantidad, idSucursal } = req.body;
            const idUsuario = req.user.id;

            // 1. Verificar stock
            const producto = await ProductoModel.obtenerDisponibilidad(idProducto, idSucursal);
            if (producto.stock < cantidad) {
                return res.status(400).json({ error: 'Stock insuficiente' });
            }

            // 2. Obtener o crear carrito activo
            let [carrito] = await CarritoModel.obtenerPorUsuario(idUsuario);
            if (!carrito || carrito.Estado !== 'activo') {
                const idCarrito = await CarritoModel.crear(idUsuario);
                carrito = { id_Carrito: idCarrito };
            }

            // 3. Agregar item
            await CarritoModel.agregarItem(
                carrito.id_Carrito, 
                idProducto, 
                cantidad, 
                producto.Precio
            );

            res.status(201).json({ mensaje: 'Producto agregado al carrito' });
        } catch (error) {
            res.status(500).json({ error: 'Error al agregar item' });
        }
    }

    async eliminarItem(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await CarritoModel.eliminarItem(id);
            
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Item no encontrado' });
            }

            res.json({ mensaje: 'Item eliminado del carrito' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar item' });
        }
    }

    async actualizarCantidad(req, res) {
        try {
            const { id } = req.params;
            const { cantidad } = req.body;
            
            const affectedRows = await CarritoModel.actualizarCantidad(id, cantidad);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Item no encontrado' });
            }

            res.json({ mensaje: 'Cantidad actualizada' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar cantidad' });
        }
    }

    async vaciarCarrito(req, res) {
        try {
            const { id } = req.params;
            await CarritoModel.vaciar(id);
            res.json({ mensaje: 'Carrito vaciado' });
        } catch (error) {
            res.status(500).json({ error: 'Error al vaciar carrito' });
        }
    }
}

module.exports = new CarritoController();