
let productoModal = document.getElementById('modalProducto');
const unidades = ["PZA", "KG", "LT", "ML", "G", "PAQ", "ROL", "PAR", "CJA"];

function cargarFormularioProductoHTML() {
    const htmlPath = '../html/form-producto.html';
    fetch(htmlPath)
        .then(response => response.text())
        .then(html => {
            productoModal.innerHTML = html;

            productoModal.querySelector('.close-button').onclick = () => productoModal.style.display = 'none';
            window.onclick = (event) => {
                if (event.target == productoModal) productoModal.style.display = 'none';
            };
            
            document.getElementById('form-producto').addEventListener('submit', guardarProducto);

            const cmbUnidad = document.getElementById('unidad');
            if (cmbUnidad.options.length === 0) {
                 unidades.forEach(u => {
                    const option = document.createElement('option');
                    option.value = u;
                    option.textContent = u;
                    cmbUnidad.appendChild(option);
                });
            }
        });
}
cargarFormularioProductoHTML();


/**
 * @param {object} producto 
 */
function abrirFormularioProducto(producto = null) {
    if (!document.getElementById('form-producto-content')) {
        setTimeout(() => abrirFormularioProducto(producto), 100); 
        return;
    }

    const isEditing = producto !== null;
    document.getElementById('form-producto-titulo').textContent = isEditing ? 'Editar Producto' : 'Crear Nuevo Producto';
    document.getElementById('btnGuardarProducto').textContent = isEditing ? 'Guardar Cambios' : 'Crear Producto';

    document.getElementById('productoId').value = isEditing ? producto.id : '';
    document.getElementById('nombre').value = isEditing ? producto.nombre : '';
    document.getElementById('categoria').value = isEditing ? producto.categoria : '';
    document.getElementById('unidad').value = isEditing ? producto.unidad : 'PZA';
    document.getElementById('stock').value = isEditing ? producto.stock : 0;
    document.getElementById('stock').disabled = isEditing; 
    document.getElementById('minimo').value = isEditing ? producto.minimo : 1;
    document.getElementById('costoUnitario').value = isEditing ? producto.costoUnitario.toFixed(2) : '0.00';
    document.getElementById('precioDeVenta').value = isEditing ? producto.precioDeVenta.toFixed(2) : '0.00';

    productoModal.style.display = 'block';
}

async function guardarProducto(e) {
    e.preventDefault();
    
    const id = document.getElementById('productoId').value;
    const isEditing = id !== '';

    const p = {
        nombre: document.getElementById('nombre').value.trim(),
        categoria: document.getElementById('categoria').value.trim(),
        unidad: document.getElementById('unidad').value,
        stock: parseInt(document.getElementById('stock').value),
        minimo: parseInt(document.getElementById('minimo').value),
        costoUnitario: parseFloat(document.getElementById('costoUnitario').value),
        precioDeVenta: parseFloat(document.getElementById('precioDeVenta').value)
    };

    if (p.nombre === '' || p.categoria === '' || p.minimo < 0) {
        alert("Verifique campos obligatorios (nombre/categoría) y que Mínimo sea 0 o más.");
        return;
    }
    
    if (isEditing) p.id = parseInt(id);

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/productos/${p.id}` : '/api/productos';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(p),
        });
        const data = await response.json();

        if (response.ok) {
            alert(`Producto ${isEditing ? 'actualizado' : 'creado'} con éxito.`);
            productoModal.style.display = 'none';
            cargarDatosProductos();
        } else {
            alert(`Fallo al guardar: ${data.message}`);
        }
    } catch (error) {
        alert("Error de conexión al guardar el producto.");
    }
}