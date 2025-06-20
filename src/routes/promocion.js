const express = require('express');
const router = express.Router();
const promocionController = require('../controllers/promocionController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

router.get('/', promocionController.listarPromociones);
router.get('/activas', promocionController.listarPromocionesActivas);
router.get('/:codigo', promocionController.obtenerPromocionPorCodigo);
router.post('/', authMiddleware, checkRole([1]), promocionController.crearPromocion);
router.put('/:id', authMiddleware, checkRole([1]), promocionController.actualizarPromocion);
router.delete('/:id', authMiddleware, checkRole([1]), promocionController.eliminarPromocion);

module.exports = router;