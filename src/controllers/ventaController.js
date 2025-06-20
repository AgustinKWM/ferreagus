const VentaModel = require('../models/ventaModel');
const CarritoModel = require('../models/carritoModel');
const { verificarStock } = require('../middleware/stockMiddleware');

class VentaController {
    async crearVenta(req, res) {
        try {
            const idUsuario = req.user.id;
            const { idCarrito, idSucursal, metodoPago } = req.body;

            // 1. Obtener items del carrito
            const items = await CarritoModel.obtenerPorUsuario(idUsuario);
            if (!items || items.length === 0) {
                return res.status(400).json({ error: 'Carrito vacío' });
            }

            // 2. Verificar stock (usando el middleware)
            await verificarStock(req, res, async () => {
                // 3. Calcular total
                const total = items.reduce((sum, item) => {
                    return sum + (item.Precio_unitario * item.Cantidad);
                }, 0);

                // 4. Crear venta
                const idVenta = await VentaModel.crear({
                    precioTotal: total,
                    sucursal: idSucursal,
                    idDetalleCarrito: items[0].id_Carrito,
                    idUsuario,
                    items,
                    metodoPago
                });

                res.status(201).json({ 
                    idVenta,
                    total,
                    mensaje: 'Venta registrada exitosamente' 
                });
            });
        } catch (error) {
            res.status(500).json({ error: 'Error al crear venta' });
        }
    }

    async obtenerVentasPorUsuario(req, res) {
        try {
            const { id } = req.params;
            const ventas = await VentaModel.obtenerPorUsuario(id);
            res.json(ventas);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener ventas' });
        }
    }

    async obtenerVenta(req, res) {
        try {
            const { id } = req.params;
            const venta = await VentaModel.obtener(id);
            
            if (!venta) {
                return res.status(404).json({ error: 'Venta no encontrada' });
            }

            res.json(venta);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener venta' });
        }
    }

    async crearDespacho(req, res) {
        try {
            const { id } = req.params;
            const datosDespacho = req.body;
            
            const idDespacho = await VentaModel.crearDespacho({
                ...datosDespacho,
                Codigo_venta: id
            });

            // Actualizar estado de venta a "en preparación"
            await VentaModel.actualizarEstado(id, 'en_preparacion');

            res.status(201).json({ idDespacho });
        } catch (error) {
            res.status(500).json({ error: 'Error al crear despacho' });
        }
    }

    async obtenerDespacho(req, res) {
        try {
            const { id } = req.params;
            const despacho = await VentaModel.obtenerDespacho(id);
            
            if (!despacho) {
                return res.status(404).json({ error: 'Despacho no encontrado' });
            }

            res.json(despacho);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener despacho' });
        }
    }

    async actualizarEstado(req, res) {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            
            const estadosValidos = ['pendiente', 'en_preparacion', 'completada', 'cancelada'];
            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({ error: 'Estado no válido' });
            }

            const affectedRows = await VentaModel.actualizarEstado(id, estado);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Venta no encontrada' });
            }

            res.json({ mensaje: 'Estado actualizado' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar estado' });
        }
    }
}

module.exports = new VentaController();