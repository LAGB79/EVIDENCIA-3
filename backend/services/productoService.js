const db = require('../db/db');

class ProductoService {
    
    static async obtenerProductos(filtroSql, textoBusqueda) {
        let sql = "SELECT id, nombre, categoria, unidad, stock, minimo, costo_unitario, precio_de_venta FROM Productos";
        let params = [];

        if (filtroSql.includes('WHERE')) {
            sql += filtroSql;
            if (textoBusqueda) {
                const likeParam = `%${textoBusqueda}%`;
                params.push(likeParam, likeParam);
            }
        }
        
        const [rows] = await db.query(sql, params);
        
        return rows.map(row => ({
            ...row,
            costoUnitario: row.costo_unitario,
            precioDeVenta: row.precio_de_venta,
            costo_unitario: undefined, 
            precio_de_venta: undefined
        }));
    }

    static async crearProducto(p) {
        const sql = "INSERT INTO Productos (nombre, categoria, unidad, stock, minimo, costo_unitario, precio_de_venta) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const [results] = await db.query(sql, [p.nombre, p.categoria, p.unidad, p.stock, p.minimo, p.costoUnitario, p.precioDeVenta]);
        return results.affectedRows > 0;
    }
    
    static async actualizarProducto(p) {
        const sql = "UPDATE Productos SET nombre=?, categoria=?, unidad=?, minimo=?, costo_unitario=?, precio_de_venta=? WHERE id=?";
        const [results] = await db.query(sql, [p.nombre, p.categoria, p.unidad, p.minimo, p.costoUnitario, p.precioDeVenta, p.id]);
        return results.affectedRows > 0;
    }
    
    static async eliminarProducto(productoId) {
        const sql = "DELETE FROM Productos WHERE id = ?";
        const [results] = await db.query(sql, [productoId]);
        return results.affectedRows > 0;
    }
    
}

module.exports = ProductoService;