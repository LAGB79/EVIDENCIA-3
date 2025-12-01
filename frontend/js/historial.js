const userRol = localStorage.getItem('user_rol'); 

document.addEventListener('DOMContentLoaded', cargarDatosHistorial);

async function cargarDatosHistorial() {
    const tbody = document.getElementById('tablaHistorialBody');
    tbody.innerHTML = ''; 
    
    try {
        const response = await fetch('/api/movimientos/historial');
        const historial = await response.json();
        
        historial.forEach(mh => {
            const row = tbody.insertRow();
            row.insertCell().textContent = mh.id;
            row.insertCell().textContent = mh.producto;
            row.insertCell().textContent = mh.tipo;
            row.insertCell().textContent = mh.cantidad;
            row.insertCell().textContent = mh.fecha;
            row.insertCell().textContent = mh.responsable;
            row.insertCell().textContent = mh.nota;

            const celdaAccion = row.insertCell();
            if (userRol === 'ADMIN') {
                const btnEliminar = document.createElement('button');
                btnEliminar.textContent = 'X';
                btnEliminar.className = 'btn-eliminar'; 
                btnEliminar.style.padding = '10px 15px'; 
                btnEliminar.onclick = () => eliminarMovimiento(mh.id);
                celdaAccion.appendChild(btnEliminar);
            } else {
                celdaAccion.textContent = '-';
            }
        });

    } catch (error) {
        alert("Error al cargar el historial de movimientos.");
    }
}

async function eliminarMovimiento(id) {
    if (!confirm("¿Estas seguro?\n\nEliminar este movimiento revertirá el stock del producto.\nSi borras una ENTRADA, el stock bajará.\nSi borras una SALIDA, el stock subirá.")) {
        return;
    }

    try {
        const response = await fetch(`/api/movimientos/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            cargarDatosHistorial(); 
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        alert("Error de conexión al eliminar.");
    }
}