# LEBAB - Sistema web de Gestion de Inventarios

![Status](https://img.shields.io/badge/Status-Terminado-success)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)
![MySQL](https://img.shields.io/badge/Database-MySQL-blue)
![Frontend](https://img.shields.io/badge/Frontend-HTML%20%2B%20CSS%20%2B%20JS-orange)

**LEBAB** es un sistema web moderno diseñado para controlar el inventario de negocios pequeños y medianos. Te permite saber qué productos tienes, registrar entradas y salidas de mercancía, y asegurarte de que tu inventario siempre esté correcto. 

## Funcionalidades del sistema

* **Ver Productos:** Lista completa de inventario con búsqueda rápida.
* **Gestión Total:** Puedes crear, editar y borrar productos.
* **Control de Stock:** Cuando registras una entrada o salida, el stock se actualiza automáticamente.
* **Alertas:** Muestra avisos visuales cuando un producto tiene poco stock.
* **Seguridad:** Permite el acceso con roles (Administrador y Operador).
* **Auditoría:** Mantiene un historial de movimientos que no se puede borrar fácilmente.

## Tecnologías Usadas

* **Servidor (Backend):** Node.js y el framework Express.
* **Base de Datos:** MySQL.
* **Interfaz (Frontend):** HTML, CSS y JavaScript puro (diseño moderno).

## Requisitos Previos

Antes de instalar, asegúrate de tener:

1.  [Node.js](https://nodejs.org/) instalado (v14 o superior).
2.  [MySQL Server](https://dev.mysql.com/downloads/) instalado y corriendo.
3.  Un cliente de Git.

## Cómo instalar y correr el sistema Local

Sigue estos 6 sencillos pasos para correr la aplicación en tu computadora.

### Paso 1: Descarga el Código
Abre la Terminal y descarga el proyecto:
git clone [https://github.com/LAGB79/EVIDENCIA-3.git](https://github.com/LAGB79/EVIDENCIA-3.git)
cd LEBAB-WEB

### Paso 2: Prepara el Servidor
Entra a la carpeta backend e instala las librerías que Node.js necesita:
cd backend
npm install

### Paso 3: Configura la Base de Datos
Abre tu gestor de base de datos y crea una base de datos llamada LEBABWEB.
Ejecuta el script SQL que crea todas las tablas y los datos iniciales de prueba.

### Paso 4: Configurar Variables de Entorno
Crea un archivo llamado .env dentro de la carpeta /backend y pon tus claves de MySQL.
DB_HOST=localhost
DB_USER=root
DB_PASSWORD="tu_contraseña_mysql"
DB_NAME=LEBABWEB
PORT=3000

### Paso 5: Enciende el Servidor
Desde la carpeta /backend, arranca el sistema:
node server.js

### Paso 5: Enciende el Servidor
Desde la carpeta /backend, arranca el sistema:
node server.js
O si tienes PM2 instalado:
pm2 start server.js --name "LEBAB"

### Paso 6: Acceder al sistema
Abre tu navegador y visita: http://localhost:3000