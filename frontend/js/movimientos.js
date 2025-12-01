let movimientoModal = document.getElementById('modalMovimiento');

function cargarFormularioMovimientoHTML() {
    const htmlPath = '../html/form-movimiento.html';
    fetch(htmlPath)
        .then(response => response.text())
        .then(html => {
            movimientoModal.innerHTML = html;
            movimientoModal.querySelector('.close-button').onclick = () => movimientoModal.style.display = 'none';
            window.onclick = (event) => {
                if (event.target == movimientoModal) movimientoModal.style.display = 'none';
            };
            document.getElementById('form-movimiento').addEventListener('submit', registrarMovimiento);
        });
}
cargarFormularioMovimientoHTML();

async function mostrarModalMovimiento() {
    await cargarProductosEnCombo();
    movimientoModal.style.display = 'block';
}

async function cargarProductosEnCombo() {
    const cmbProducto = document.getElementById('cmbProducto');
    cmbProducto.innerHTML = '';
    
    try {
        const response = await fetch('/api/productos');
        const productos = await response.json();
        
        productos.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = p.nombre;
            cmbProducto.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar productos para el combo:", error);
    }
}

async function registrarMovimiento(e) {
    e.preventDefault();
    
    const productoId = parseInt(document.getElementById('cmbProducto').value);
    const tipo = document.getElementById('cmbTipo').value;
    const cantidad = parseInt(document.getElementById('txtCantidadMov').value);
    const nota = document.getElementById('txtNota').value;
    const responsableId = parseInt(localStorage.getItem('user_id'));
    
    if (isNaN(cantidad) || cantidad <= 0) {
         alert("La cantidad debe ser un número entero válido mayor que cero.");
         return;
    }
    
    const movimientoData = { productoId, tipo, cantidad, responsableId, nota };
    
    try {
        const response = await fetch('/api/movimientos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movimientoData),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            movimientoModal.style.display = 'none';
            cargarDatosProductos(); 
        } else if (response.status === 409) { 
            alert(`Error de Stock: ${data.message}`);
        } else {
            alert(`Fallo al registrar el movimiento: ${data.message}`);
        }
    } catch (error) {
        alert('Error de conexión con el servidor al registrar movimiento.');
    }
}