const express = require('express');
const router = express.Router();
const ProductoService = require('../services/productoService');

const checkRole = (requiredRole) => (req, res, next) => {
    if (requiredRole === 'OPERADOR') {
        return next(); 
    }
    if (requiredRole === 'ADMIN') {
        return next(); 
    }
    res.status(403).json({ message: "Acceso denegado." });
};

router.get('/', async (req, res) => {
    try {
        const { search, bajoStock } = req.query;
        let filtroSql = "";
        let textoBusqueda = search || "";

        if (search) {
            filtroSql += " WHERE nombre LIKE ? OR categoria LIKE ? ";
        }
        
        if (bajoStock === 'true') {
            filtroSql += search ? " AND stock <= minimo" : " WHERE stock <= minimo";
        }
        
        const productos = await ProductoService.obtenerProductos(filtroSql, textoBusqueda);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

router.post('/', checkRole('OPERADOR'), async (req, res) => { 
    try {
        const exito = await ProductoService.crearProducto(req.body);
        if (exito) {
            res.status(201).json({ message: "Producto creado con éxito." });
        } else {
            res.status(400).json({ message: "Fallo al crear el producto. Nombre duplicado." });
        }
    } catch (error) {
        res.status(400).json({ message: "Error de BD. El producto puede ya existir." });
    }
});

router.put('/:id', checkRole('OPERADOR'), async (req, res) => { 
    try {
        const p = req.body;
        p.id = parseInt(req.params.id);
        const exito = await ProductoService.actualizarProducto(p);
        if (exito) {
            res.json({ message: "Producto actualizado con éxito." });
        } else {
            res.status(404).json({ message: "Producto no encontrado." });
        }
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar el producto." });
    }
});

router.delete('/:id', checkRole('ADMIN'), async (req, res) => { 
    try {
        const exito = await ProductoService.eliminarProducto(parseInt(req.params.id));
        if (exito) {
            res.json({ message: "Producto eliminado con éxito." });
        } else {
            res.status(404).json({ message: "Producto no encontrado." });
        }
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
            return res.status(409).json({ message: "No se puede eliminar el producto porque tiene movimientos registrados." });
        }
        res.status(500).json({ message: "Error interno del servidor al eliminar." });
    }
});

module.exports = router;