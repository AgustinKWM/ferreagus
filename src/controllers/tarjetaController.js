const Tarjeta = require('../models/tarjetaModel');

const tarjetaController = {
  agregarTarjeta: async (req, res) => {
    try {
      const { numero_tarjeta, nombre_titular, fecha_exp, cvv } = req.body;
      const usuarioId = req.user.id;

      // Validación básica
      if (!numero_tarjeta || !nombre_titular || !fecha_exp || !cvv) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }

      // Validar formato de fecha MM/YY
      if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(fecha_exp)) {
        return res.status(400).json({ error: 'Formato de fecha inválido (MM/YY)' });
      }

      // Validar CVV (3 o 4 dígitos)
      if (!/^[0-9]{3,4}$/.test(cvv)) {
        return res.status(400).json({ error: 'CVV inválido' });
      }

      const idTarjeta = await Tarjeta.crear({
        numero_tarjeta,
        nombre_titular,
        fecha_exp,
        cvv,
        usuarioId
      });

      res.status(201).json({ 
        mensaje: 'Tarjeta agregada exitosamente',
        idTarjeta
      });
    } catch (error) {
      console.error('Error al agregar tarjeta:', error);
      res.status(500).json({ error: 'Error al agregar tarjeta' });
    }
  },

  listarTarjetas: async (req, res) => {
    try {
      const tarjetas = await Tarjeta.obtenerPorUsuario(req.user.id);
      res.json(tarjetas);
    } catch (error) {
      console.error('Error al listar tarjetas:', error);
      res.status(500).json({ error: 'Error al listar tarjetas' });
    }
  },

  eliminarTarjeta: async (req, res) => {
    try {
      const { id } = req.params;
      const eliminado = await Tarjeta.eliminar(id, req.user.id);

      if (!eliminado) {
        return res.status(404).json({ error: 'Tarjeta no encontrada' });
      }

      res.json({ mensaje: 'Tarjeta eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar tarjeta:', error);
      res.status(500).json({ error: 'Error al eliminar tarjeta' });
    }
  }
};

module.exports = tarjetaController;