const db = require('../config/db');

class Tarjeta {
  static async crear({ numero_tarjeta, nombre_titular, fecha_exp, cvv, usuarioId }) {
    // Encriptar datos sensibles antes de guardar (implementación básica)
    const numeroEncriptado = this.encriptar(numero_tarjeta);
    const cvvEncriptado = this.encriptar(cvv.toString());

    const [result] = await db.query(
      `INSERT INTO Tarjeta_credito 
       (Numero_tarjeta, Nombre_titular, Fecha_exp, cvv, Usuario_idUsuario) 
       VALUES (?, ?, ?, ?, ?)`,
      [numeroEncriptado, nombre_titular, fecha_exp, cvvEncriptado, usuarioId]
    );
    return result.insertId;
  }

  static async obtenerPorUsuario(usuarioId) {
    const [rows] = await db.query(
      `SELECT id_tarjeta, 
              CONCAT('•••• •••• •••• ', RIGHT(Numero_tarjeta, 4)) as numero_masked,
              Nombre_titular, 
              Fecha_exp
       FROM Tarjeta_credito 
       WHERE Usuario_idUsuario = ?`,
      [usuarioId]
    );
    return rows;
  }

  static async eliminar(idTarjeta, usuarioId) {
    const [result] = await db.query(
      `DELETE FROM Tarjeta_credito 
       WHERE id_tarjeta = ? AND Usuario_idUsuario = ?`,
      [idTarjeta, usuarioId]
    );
    return result.affectedRows;
  }

  // Método helper para encriptación (en producción usar algoritmos más seguros)
  static encriptar(texto) {
    // Implementación básica - ¡Reemplazar por librería de encriptación real!
    return Buffer.from(texto).toString('base64');
  }
}

module.exports = Tarjeta;