require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_NAME || 'tienda',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'local',
  charset: 'utf8mb4',
  decimalNumbers: true,
  multipleStatements: false,
  connectTimeout: 10000,
  dateStrings: true
});

// Verificación de conexión
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('\x1b[32m', '✅ Conectado a MySQL correctamente', '\x1b[0m');
    conn.release();
    
    // Verificar tablas esenciales
    const [tables] = await pool.query(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?",
      [process.env.DB_NAME || 'tienda']
    );
    
    const requiredTables = ['usuario', 'producto', 'carrito_compra', 'detalle_carrito', 'venta', 'promocion'];
    const existingTables = tables.map(t => t.TABLE_NAME);
    const missingTables = requiredTables.filter(t => !existingTables.includes(t));
    
    if (missingTables.length > 0) {
      console.error('\x1b[31m', `❌ Tablas faltantes: ${missingTables.join(', ')}`, '\x1b[0m');
    } else {
      console.log('\x1b[32m', '✅ Estructura de base de datos verificada', '\x1b[0m');
    }
  } catch (err) {
    console.error('\x1b[31m', '❌ Error de conexión a MySQL:', {
      message: err.message,
      code: err.code
    }, '\x1b[0m');
    process.exit(1);
  }
})();

module.exports = pool;