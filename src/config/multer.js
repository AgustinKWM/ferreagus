const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(__dirname, '../temp_uploads');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Configuración de Multer para subida simple
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const validFormats = ['.png', '.jpg', '.jpeg', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, validFormats.includes(ext));
  },
  limits: { fileSize: 2 * 1024 * 1024 } // Límite 2MB
});

// Configuración de Multer para carga múltiple
const uploadMultiple = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const validFormats = ['.png', '.jpg', '.jpeg', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, validFormats.includes(ext));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // Límite 5MB
});

module.exports = {
  singleUpload: upload.single('logo'), // Middleware para subida única
  multipleUpload: uploadMultiple.array('logos', 10) // Middleware para múltiples archivos
};