const Marca = require('../models/marcaModel');
const fs = require('fs');
const path = require('path');

const marcaController = {
  // En el método crear, actualiza el manejo de errores:
crear: async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'Logo es requerido' 
      });
    }

    const { filename: logo, path: tempPath } = req.file;
    
    // Validar nombre de marca
    if (!nombre || typeof nombre !== 'string') {
      // Eliminar archivo subido si la validación falla
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
      return res.status(400).json({
        success: false,
        error: 'Nombre de marca inválido'
      });
    }

    // Crear estructura de directorios
    const targetDir = path.join('public', 'marcas', nombre.toLowerCase());
    const targetPath = path.join(targetDir, logo);
    
    fs.mkdirSync(targetDir, { recursive: true });
    fs.renameSync(tempPath, targetPath);

    const logo_path = `marcas/${nombre.toLowerCase()}/${logo}`;
    const id = await Marca.crear({ nombre, descripcion, logo, logo_path });
    
    res.status(201).json({ 
      success: true,
      id,
      message: 'Marca creada exitosamente'
    });
  } catch (error) {
    // Limpiar archivos temporales en caso de error
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    console.error('Error al crear marca:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al crear marca',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
},
  listar: async (req, res) => {
    try {
      const marcas = await Marca.obtenerTodas();
      res.json({
        success: true,
        count: marcas.length,
        data: marcas
      });
    } catch (error) {
      console.error('Error al listar marcas:', error);
      res.status(500).json({ 
        error: 'Error al listar marcas',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const marca = await Marca.obtenerPorId(req.params.id);
      if (!marca) {
        return res.status(404).json({ 
          error: 'Marca no encontrada',
          details: `No se encontró marca con ID ${req.params.id}`
        });
      }
      res.json({
        success: true,
        data: marca
      });
    } catch (error) {
      console.error('Error al obtener marca:', error);
      res.status(500).json({ 
        error: 'Error al obtener marca',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const datos = req.body;
      
      // Si se subió nuevo logo
      if (req.file) {
        const { filename: logo, path: tempPath } = req.file;
        const targetDir = path.join('public', 'marcas', datos.nombre.toLowerCase());
        const targetPath = path.join(targetDir, logo);
        
        fs.mkdirSync(targetDir, { recursive: true });
        fs.renameSync(tempPath, targetPath);

        datos.logo = logo;
        datos.logo_path = `marcas/${datos.nombre.toLowerCase()}/${logo}`;
      }

      const actualizado = await Marca.actualizar(id, datos);
      
      if (actualizado === 0) {
        return res.status(404).json({ 
          error: 'Marca no encontrada',
          details: `No se encontró marca con ID ${id} para actualizar`
        });
      }

      res.json({
        success: true,
        message: 'Marca actualizada exitosamente',
        updated: actualizado
      });
    } catch (error) {
      console.error('Error al actualizar marca:', error);
      res.status(500).json({ 
        error: 'Error al actualizar marca',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const eliminado = await Marca.eliminar(id);
      
      if (eliminado === 0) {
        return res.status(404).json({ 
          error: 'Marca no encontrada',
          details: `No se encontró marca con ID ${id} para eliminar`
        });
      }

      res.json({
        success: true,
        message: 'Marca eliminada exitosamente',
        deleted: eliminado
      });
    } catch (error) {
      console.error('Error al eliminar marca:', error);
      res.status(500).json({ 
        error: 'Error al eliminar marca',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  cargaInicial: async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No se subieron archivos' });
      }

      const tempDir = path.join(__dirname, '../../temp_uploads');
      const results = [];

      for (const file of req.files) {
        try {
          const marcaName = file.originalname.split('_')[0].toLowerCase();
          const marca = await Marca.buscarPorNombre(marcaName);
          
          if (marca) {
            const targetDir = path.join('public', 'marcas', marcaName);
            const newFilename = `${marcaName}_logo${path.extname(file.originalname)}`;
            const targetPath = path.join(targetDir, newFilename);

            fs.mkdirSync(targetDir, { recursive: true });
            fs.renameSync(file.path, targetPath);

            await Marca.actualizar(marca.id_marca, {
              logo: newFilename,
              logo_path: `marcas/${marcaName}/${newFilename}`
            });

            results.push({
              marca: marca.nombre,
              file: newFilename,
              status: 'success'
            });
          } else {
            results.push({
              file: file.originalname,
              status: 'error',
              error: `Marca ${marcaName} no encontrada en BD`
            });
          }
        } catch (error) {
          results.push({
            file: file.originalname,
            status: 'error',
            error: error.message
          });
        }
      }

      // Limpiar directorio temporal
      fs.rmSync(tempDir, { recursive: true, force: true });

      res.json({
        success: true,
        message: 'Carga inicial completada',
        results
      });
    } catch (error) {
      console.error('Error en carga inicial:', error);
      res.status(500).json({ 
        error: 'Error en carga inicial',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = marcaController;