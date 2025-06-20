const SucursalModel = require('../models/sucursalModel');

class SucursalController {
    async listarSucursales(req, res) {
        try {
            const sucursales = await SucursalModel.listar();
            res.json(sucursales);
        } catch (error) {
            res.status(500).json({ error: 'Error al listar sucursales' });
        }
    }

    async obtenerSucursal(req, res) {
        try {
            const { id } = req.params;
            const sucursal = await SucursalModel.obtener(id);
            
            if (!sucursal) {
                return res.status(404).json({ error: 'Sucursal no encontrada' });
            }

            res.json(sucursal);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener sucursal' });
        }
    }

    async obtenerInventario(req, res) {
        try {
            const { id } = req.params;
            const inventario = await SucursalModel.obtenerInventario(id);
            res.json(inventario);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener inventario' });
        }
    }

    async obtenerBodegas(req, res) {
        try {
            const { id } = req.params;
            const bodegas = await SucursalModel.obtenerBodegas(id);
            res.json(bodegas);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener bodegas' });
        }
    }
}

module.exports = new SucursalController();