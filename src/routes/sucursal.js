const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursalController');

router.get('/', sucursalController.listarSucursales);
router.get('/:id', sucursalController.obtenerSucursal);
router.get('/:id/inventario', sucursalController.obtenerInventario);
router.get('/:id/bodegas', sucursalController.obtenerBodegas);

module.exports = router;