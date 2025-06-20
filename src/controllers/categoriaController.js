const Categoria = require('../models/categoriaModel');

const categoriaController = {
  listar: async (req, res) => {
    try {
      const categorias = await Categoria.obtenerTodas();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: 'Error al listar categorías' });
    }
  }
};

module.exports = categoriaController;