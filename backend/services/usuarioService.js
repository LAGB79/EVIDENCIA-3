const db = require('../db/db');

class UsuarioService {

    static async autenticar(username, password) {
        const sql = "SELECT id, rol FROM Usuario WHERE username = ? AND password = ?";
        const [rows] = await db.query(sql, [username, password]);

        if (rows.length > 0) {
            return { id: rows[0].id, rol: rows[0].rol };
        }
        return null;
    }
    
    static async obtenerTodos() {
        const sql = "SELECT id, username, rol FROM Usuario";
        const [rows] = await db.query(sql);
        return rows;
    }

    static async crearUsuario(u) {
        const sql = "INSERT INTO Usuario (username, password, rol) VALUES (?, ?, ?)";
        const [results] = await db.query(sql, [u.username, u.password, u.rol]);
        return results.affectedRows > 0;
    }
    
    static async eliminarUsuario(userId) {
        const sql = "DELETE FROM Usuario WHERE id = ?";
        const [results] = await db.query(sql, [userId]);
        return results.affectedRows > 0;
    }
}

module.exports = UsuarioService;