const PromocionModel = require('../models/promocionModel');

class PromocionController {
    async listarPromociones(req, res) {
        try {
            const promociones = await PromocionModel.listar();
            res.json(promociones);
        } catch (error) {
            res.status(500).json({ error: 'Error al listar promociones' });
        }
    }

    async listarPromocionesActivas(req, res) {
        try {
            const promociones = await PromocionModel.listarActivas();
            res.json(promociones);
        } catch (error) {
            res.status(500).json({ error: 'Error al listar promociones activas' });
        }
    }

    async obtenerPromocionPorCodigo(req, res) {
        try {
            const { codigo } = req.params;
            const promocion = await PromocionModel.obtenerPorCodigo(codigo);
            
            if (!promocion) {
                return res.status(404).json({ error: 'Promoción no encontrada o expirada' });
            }

            res.json(promocion);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener promoción' });
        }
    }

    async crearPromocion(req, res) {
        try {
            const nuevaPromocion = req.body;
            const id = await PromocionModel.crear(nuevaPromocion);
            res.status(201).json({ id });
        } catch (error) {
            res.status(500).json({ error: 'Error al crear promoción' });
        }
    }

    async actualizarPromocion(req, res) {
        try {
            const { id } = req.params;
            const datos = req.body;
            
            const affectedRows = await PromocionModel.actualizar(id, datos);
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Promoción no encontrada' });
            }

            res.json({ mensaje: 'Promoción actualizada' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar promoción' });
        }
    }

    async eliminarPromocion(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await PromocionModel.eliminar(id);
            
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Promoción no encontrada' });
            }

            res.json({ mensaje: 'Promoción eliminada' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar promoción' });
        }
    }
}

module.exports = new PromocionController();