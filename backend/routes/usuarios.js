const express = require('express');
const router = express.Router();
const UsuarioService = require('../services/usuarioService');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const usuario = await UsuarioService.autenticar(username, password);
        if (usuario) {
            res.json({ message: "Login exitoso", id: usuario.id, rol: usuario.rol });
        } else {
            res.status(401).json({ message: "Usuario o contraseña incorrectos." }); 
        }
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

router.get('/', async (req, res) => {
    try {
        const usuarios = await UsuarioService.obtenerTodos();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios." });
    }
});

router.post('/', async (req, res) => {
    try {
        const exito = await UsuarioService.crearUsuario(req.body);
        if (exito) {
            res.status(201).json({ message: "Usuario creado con éxito." });
        } else {
            res.status(400).json({ message: "Fallo al crear el usuario." });
        }
    } catch (error) {
        res.status(400).json({ message: "Error de BD. El nombre de usuario puede ya existir." });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const exito = await UsuarioService.eliminarUsuario(userId);
        if (exito) {
            res.json({ message: "Usuario eliminado con éxito." });
        } else {
            res.status(404).json({ message: "Usuario no encontrado." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar usuario." });
    }
});

module.exports = router;