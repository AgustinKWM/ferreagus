const db = require('../config/db');

class Categoria {
  static async obtenerTodas() {
    const [rows] = await db.query('SELECT * FROM categoria');
    return rows;
  }
}

module.exports = Categoria;