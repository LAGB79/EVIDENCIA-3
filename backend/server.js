const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const productoRoutes = require('./routes/productos');
const movimientoRoutes = require('./routes/movimientos');
const usuarioRoutes = require('./routes/usuarios');

app.use(express.json());

app.use(express.static('../frontend'));
app.use('/html', express.static('../frontend/html')); 

app.use('/api/productos', productoRoutes);
app.use('/api/movimientos', movimientoRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.listen(PORT, () => {
    console.log(`Servidor Node.js corriendo en http://localhost:${PORT}`);
    console.log(`Punto de entrada: http://localhost:${PORT}`);
});