document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = ''; 

    try {
        const response = await fetch('/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('user_id', data.id);
            localStorage.setItem('user_rol', data.rol);
            localStorage.setItem('user_username', username);

            alert(`Bienvenido, ${username} (${data.rol})`);
            
            window.location.href = 'html/productos.html';

        } else {
            errorMessage.textContent = data.message || 'Error desconocido.';
            document.getElementById('password').value = '';
        }
    } catch (error) {
        errorMessage.textContent = 'Error de conexión con el servidor. Verifique que el backend esté corriendo.';
    }
});