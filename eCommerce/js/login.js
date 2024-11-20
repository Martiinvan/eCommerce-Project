document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('emailin').value;
            const password = document.getElementById('passwordin').value;

            const url = 'https://673b7874339a4ce4451c54ba.mockapi.io/Usuario';

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }
                    return response.json();
                })
                .then(users => {
                    const usuarioEncontrado = users.find(user => user.email === email && user.password === password);

                    if (usuarioEncontrado) {
                        // Guardar información del usuario
                        localStorage.setItem('usuarioActual', JSON.stringify(usuarioEncontrado));
                        // PONEMOS SESIÓN ACTIVA DEL USUARIO
                        sessionStorage.setItem('isLoggedIn', 'true');

                        // Guardar indicador para mostrar la alerta en la página de inicio
                        sessionStorage.setItem('showWelcomeAlert', 'true');

                        // Redirigir a la página principal después de iniciar sesión
                        window.location.href = '../index.html'; // Aquí la URL de tu página de inicio
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error de Inicio de Sesión',
                            text: 'Correo electrónico o contraseña incorrectos'
                        });
                    }
                })
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un problema al iniciar sesión'
                    });
                    console.error('Hubo un error:', error);
                });
        });
    }
});
