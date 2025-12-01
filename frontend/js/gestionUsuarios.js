let usuarioModal = document.getElementById('modalUsuario');

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('user_rol') !== 'ADMIN') {
        alert("Acceso denegado.");
        window.location.href = 'productos.html';
        return;
        document.addEventListener('DOMContentLoaded', () => {

    
    document.getElementById('tablaUsuariosBody').addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        if (row) {
            document.querySelectorAll('#tablaUsuariosBody tr').forEach(r => r.classList.remove('selected'));
            row.classList.add('selected');
        }
    });

});
    }
    

    cargarDatosUsuarios();
    
    document.getElementById('btnCrearUsuario').addEventListener('click', mostrarModalUsuario);
    document.getElementById('btnEliminarUsuario').addEventListener('click', eliminarUsuario);
    document.getElementById('tablaUsuariosBody').addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        if (row) {
            document.querySelectorAll('#tablaUsuariosBody tr').forEach(r => r.classList.remove('selected'));
            row.classList.add('selected');
        }
    });
});

async function cargarDatosUsuarios() {
    const tbody = document.getElementById('tablaUsuariosBody');
    tbody.innerHTML = ''; 
    
    try {
        const response = await fetch('/api/usuarios');
        const usuarios = await response.json();
        
        usuarios.forEach(u => {
            const row = tbody.insertRow();
            row.insertCell().textContent = u.id;
            row.insertCell().textContent = u.username;
            row.insertCell().textContent = u.rol;
        });

    } catch (error) {
        alert("Error al cargar la lista de usuarios.");
    }
}


function mostrarModalUsuario() {
    usuarioModal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h3>Crear Nuevo Usuario</h3>
            <form id="form-crear-usuario">
                <label for="newUsername">Nombre de Usuario:</label>
                <input type="text" id="newUsername" required>

                <label for="newPassword">Contraseña:</label>
                <input type="password" id="newPassword" required>

                <label for="cmbRol">Rol:</label>
                <select id="cmbRol">
                    <option value="ADMIN">ADMIN</option>
                    <option value="OPERADOR">OPERADOR</option>
                </select>
                <button type="submit" style="margin-top: 15px;">Guardar Usuario</button>
            </form>
        </div>
    `;

    usuarioModal.style.display = 'block';
    usuarioModal.querySelector('.close-button').onclick = () => usuarioModal.style.display = 'none';
    usuarioModal.querySelector('#form-crear-usuario').addEventListener('submit', guardarUsuario);
}

async function guardarUsuario(e) {
    e.preventDefault();
    
    const u = {
        username: document.getElementById('newUsername').value.trim(),
        password: document.getElementById('newPassword').value,
        rol: document.getElementById('cmbRol').value,
    };

    if (u.username === '' || u.password === '') {
        alert("Todos los campos son obligatorios.");
        return;
    }
    
    try {
        const response = await fetch('/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(u),
        });
        const data = await response.json();

        if (response.ok) {
            alert(`Usuario ${u.username} creado.`);
            usuarioModal.style.display = 'none';
        } else {
            alert(`Fallo al crear el usuario: ${data.message}`);
        }
    } catch (error) {
        alert("Error de conexión al crear usuario.");
    } finally {
        cargarDatosUsuarios(); 
    }
}

function getUsuarioSeleccionado() {
    const fila = document.querySelector('#tablaUsuariosBody tr.selected');
    if (!fila) return null;
    
    return {
        id: parseInt(fila.cells[0].textContent),
        username: fila.cells[1].textContent
    };
}


async function eliminarUsuario() {
    const u = getUsuarioSeleccionado();
    
    if (!u) {
        alert("Seleccione un usuario para eliminar.");
        return;
    }

    const currentUserId = parseInt(localStorage.getItem('user_id'));

    if (u.id === currentUserId) {
        alert("Error: No puedes eliminar tu propio usuario mientras tienes la sesión activa.");
        return; 
    }

    if (!confirm(`¿Está seguro de eliminar al usuario '${u.username}'?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/usuarios/${u.id}`, {
            method: 'DELETE',
        });
        const data = await response.json();

        if (response.ok) {
            alert(`Usuario ${u.username} eliminado.`);
        } else {
            alert(`No se pudo eliminar el usuario: ${data.message}`);
        }
    } catch (error) {
        alert("Error de conexión al eliminar usuario.");
    } finally {
        cargarDatosUsuarios();
    }
}