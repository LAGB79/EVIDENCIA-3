const formatCurrency = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) {
        return '0.00';
    }
    return num.toFixed(2);
};
const userRol = localStorage.getItem('user_rol');
const responsableId = localStorage.getItem('user_id');

document.addEventListener('DOMContentLoaded', () => {
    if (!userRol) {
        window.location.href = '../index.html'; 
        return;
    }
    
    document.getElementById('user-info').textContent = `${localStorage.getItem('user_username')} (${userRol})`;
    aplicarRestriccionesRol();
    cargarDatosProductos();
    inicializarEventos();
});

function aplicarRestriccionesRol() {
    const isOperador = userRol === 'OPERADOR';
    document.getElementById('btnEliminar').style.display = isOperador ? 'none' : 'inline-block';
    document.getElementById('btn-gestion-usuarios').style.display = isOperador ? 'none' : 'inline-block';
}


function inicializarEventos() {
    document.getElementById('btnBuscar').addEventListener('click', cargarDatosProductos);
    document.getElementById('chkSoloBajoStock').addEventListener('change', cargarDatosProductos);
    document.getElementById('btnLimpiar').addEventListener('click', limpiarBusqueda);
    document.getElementById('btnCrear').addEventListener('click', () => abrirFormularioProducto());
    document.getElementById('btnEditar').addEventListener('click', editarProducto);
    document.getElementById('btnEliminar').addEventListener('click', eliminarProducto);
    document.getElementById('btnMovimiento').addEventListener('click', abrirVentanaMovimiento);
    document.getElementById('btn-cerrar-sesion').addEventListener('click', cerrarSesion);
    document.getElementById('btn-gestion-usuarios').addEventListener('click', () => window.location.href = 'gestion-usuarios.html');
    document.getElementById('btn-ver-historial').addEventListener('click', () => window.location.href = 'historial.html');
    document.getElementById('tablaProductosBody').addEventListener('click', (e) => {
        const row = e.target.closest('tr'); 
        if (row) {
            document.querySelectorAll('#tablaProductosBody tr').forEach(r => r.classList.remove('selected'));
            row.classList.add('selected');
        }
    });
}

async function cargarDatosProductos() {
    const txtBusqueda = document.getElementById('txtBusqueda').value;
    const chkSoloBajoStock = document.getElementById('chkSoloBajoStock').checked;
    const tbody = document.getElementById('tablaProductosBody');
    tbody.innerHTML = ''; 

    let url = `/api/productos`;
    const params = new URLSearchParams();
    
    if (txtBusqueda) params.append('search', txtBusqueda);
    if (chkSoloBajoStock) params.append('bajoStock', true);
    
    if (params.toString()) {
        url += '?' + params.toString();
    }

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ message: 'Respuesta no JSON o error desconocido del servidor.' }));
        
            throw new Error(`[Estado ${response.status}] ${errorBody.message || 'Error del servidor al obtener datos.'}`);
        }

        const productos = await response.json();



        productos.forEach(p => {
            const row = tbody.insertRow();
            row.id = `producto-${p.id}`; 
            
            if (p.stock <= p.minimo) {
                row.classList.add('bajo-stock');
            }

            row.insertCell().textContent = p.id;
            row.insertCell().textContent = p.nombre;
            row.insertCell().textContent = p.categoria;
            row.insertCell().textContent = p.unidad;
            row.insertCell().textContent = p.stock;
            row.insertCell().textContent = p.minimo;
            row.insertCell().textContent = formatCurrency(p.costoUnitario); 
            row.insertCell().textContent = formatCurrency(p.precioDeVenta); 
        });
        
    } catch (error) {
        console.error("Fallo al cargar productos:", error);
        
        alert(`No se pudieron cargar los datos del inventario. Detalle: ${error.message || 'Error de red desconocido'}`);
    }
}

function getProductoSeleccionado() {
    const fila = document.querySelector('#tablaProductosBody tr.selected');
    if (!fila) return null;
    return {
        id: parseInt(fila.cells[0].textContent),
        nombre: fila.cells[1].textContent,
        categoria: fila.cells[2].textContent,
        unidad: fila.cells[3].textContent,
        stock: parseInt(fila.cells[4].textContent),
        minimo: parseInt(fila.cells[5].textContent),
        costoUnitario: parseFloat(fila.cells[6].textContent),
        precioDeVenta: parseFloat(fila.cells[7].textContent)
    };
}

function editarProducto() {
    const p = getProductoSeleccionado();
    if (!p) {
        alert("Seleccione un producto para editar.");
        return;
    }
    abrirFormularioProducto(p);
}

async function eliminarProducto() {
    if (userRol !== 'ADMIN') return; 
    const p = getProductoSeleccionado();
    if (!p) {
        alert("Seleccione un producto para eliminar.");
        return;
    }

    if (!confirm(`¿Está seguro de eliminar el producto '${p.nombre}'?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/productos/${p.id}`, {
            method: 'DELETE',
        });
        const data = await response.json();

        if (response.ok) {
            alert(data.message);
        } else if (response.status === 409) {
            alert(`Error: ${data.message}`);
        } else {
            alert(`Error al eliminar: ${data.message}`);
        }
    } catch (error) {
        alert("Error de conexión al intentar eliminar el producto.");
    } finally {
        cargarDatosProductos();
    }
}

function abrirVentanaMovimiento() {
    mostrarModalMovimiento();
}

function cerrarSesion() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_rol');
    localStorage.removeItem('user_username');
    window.location.href = '../index.html';
}

function limpiarBusqueda() {
    document.getElementById('txtBusqueda').value = '';
    document.getElementById('chkSoloBajoStock').checked = false;
    
    cargarDatosProductos();
}