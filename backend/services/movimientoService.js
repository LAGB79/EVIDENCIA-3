const db = require('../db/db');

class MovimientoService {
    
    static async registrarYActualizarStock(productoId, tipo, cantidad, responsableId, nota) {
        let connection;
        try {
            connection = await db.getConnection(); 
            await connection.beginTransaction(); 

            const [stockRows] = await connection.query("SELECT stock FROM Productos WHERE id = ?", [productoId]);
            
            if (stockRows.length === 0) {
                await connection.rollback();
                throw new Error("Producto no encontrado.");
            }
            
            const stockActual = stockRows[0].stock;
            let nuevoStock;
            
            if (tipo === "ENTRADA") {
                nuevoStock = stockActual + cantidad;
            } else if (tipo === "SALIDA") {
                if (stockActual < cantidad) {
                    await connection.rollback();
                    return { success: false, message: `Stock insuficiente (actual: ${stockActual}) para esta SALIDA.` };
                }
                nuevoStock = stockActual - cantidad;
            } else {
                await connection.rollback();
                return { success: false, message: "Tipo de movimiento no válido." };
            }
            
            await connection.query("UPDATE Productos SET stock = ? WHERE id = ?", [nuevoStock, productoId]);

            const sqlInsertMovimiento = "INSERT INTO Movimientos (producto_id, tipo, cantidad, fecha, responsable_id, nota) VALUES (?, ?, ?, NOW(), ?, ?)";
            await connection.query(sqlInsertMovimiento, [productoId, tipo, cantidad, responsableId, nota]);
            
            await connection.commit(); 
            return { success: true, message: "Movimiento registrado y Stock actualizado con éxito." };

        } catch (error) {
            if (connection) {
                await connection.rollback(); 
            }
            throw error; 
        } finally {
            if (connection) await connection.release(); 
        }
    }
    
    static async obtenerHistorialCompleto() {
        const sql = `
            SELECT 
                m.id, 
                p.nombre AS producto, 
                m.tipo, 
                m.cantidad, 
                DATE_FORMAT(m.fecha, '%Y-%m-%d %H:%i:%s') AS fecha, 
                u.username AS responsable, 
                m.nota
            FROM Movimientos m
            JOIN Productos p ON m.producto_id = p.id
            JOIN Usuario u ON m.responsable_id = u.id
            ORDER BY m.fecha DESC
        `;
        const [rows] = await db.query(sql);
        return rows;
    }

static async eliminarMovimiento(movimientoId) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            const [rows] = await connection.query("SELECT * FROM Movimientos WHERE id = ?", [movimientoId]);
            
            if (rows.length === 0) {
                await connection.rollback();
                throw new Error("Movimiento no encontrado.");
            }

            const mov = rows[0];
            let sqlUpdateStock;
            
            if (mov.tipo === 'ENTRADA') {
                sqlUpdateStock = "UPDATE Productos SET stock = stock - ? WHERE id = ?";
            } else {
                sqlUpdateStock = "UPDATE Productos SET stock = stock + ? WHERE id = ?";
            }

            await connection.query(sqlUpdateStock, [mov.cantidad, mov.producto_id]);
            await connection.query("DELETE FROM Movimientos WHERE id = ?", [movimientoId]);

            await connection.commit();
            return { success: true, message: "Movimiento eliminado y stock revertido correctamente." };

        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) await connection.release();
        }
    }
}



module.exports = MovimientoService;