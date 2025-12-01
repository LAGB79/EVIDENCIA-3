const express = require('express');
const router = express.Router();
const MovimientoService = require('../services/movimientoService');

router.post('/', async (req, res) => {
    const { productoId, tipo, cantidad, responsableId, nota } = req.body;
    
    if (!productoId || !tipo || !cantidad || !responsableId || cantidad <= 0) {
        return res.status(400).json({ success: false, message: "Datos de movimiento incompletos o inválidos." });
    }

    try {
        const resultado = await MovimientoService.registrarYActualizarStock(productoId, tipo, cantidad, responsableId, nota);
        
        if (resultado.success) {
            res.status(201).json(resultado);
        } else {
            res.status(409).json(resultado);
        }
    } catch (error) {
        console.error("Error en la transacción de movimiento:", error.message);
        res.status(500).json({ success: false, message: "Error interno en la transacción. Revise que los IDs existan." });
    }
});


router.get('/historial', async (req, res) => {
    try {
        const historial = await MovimientoService.obtenerHistorialCompleto();
        res.json(historial);
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const resultado = await MovimientoService.eliminarMovimiento(id);
        res.json(resultado);
    } catch (error) {
        console.error("Error al eliminar movimiento:", error);
        res.status(500).json({ message: "Error al eliminar el movimiento. Verifique consistencia de datos." });
    }
});

module.exports = router;