document.addEventListener('DOMContentLoaded', () => {
    // Verificar si el usuario está logueado
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const showWelcomeAlert = sessionStorage.getItem('showWelcomeAlert');

    // Mostrar la alerta si el indicador está presente
    if (showWelcomeAlert === 'true') {
        // Mostrar alerta tipo toast o normal
        Swal.fire({
            icon: 'success',
            title: `Bienvenido ${usuarioActual.name}`,
            text: 'Has iniciado sesión correctamente.',
        });

        // Eliminar el indicador para que no se muestre nuevamente
        sessionStorage.removeItem('showWelcomeAlert');
    }

    // Actualizar el menú dependiendo del estado de login
    const userDropdown = document.getElementById('user-dropdown');
    
    if (isLoggedIn === 'true' && usuarioActual) {
        // Si está logueado, mostrar el menú con nombre de usuario y opciones
        userDropdown.innerHTML = `
            <li class="dropdown-header text-center">
                <span>Hola, ${usuarioActual.name}</span>
            </li>
            <li><a class="dropdown-item" href="#">Mi Perfil</a></li>
            <li><hr class="dropdown-divider" /></li>
            <li><a class="dropdown-item" href="#" id="cerrarSesion">Cerrar Sesión</a></li>
        `;
        // Agregar el evento para cerrar sesión
        document.getElementById('cerrarSesion').addEventListener('click', cerrarSesion);
    } else {
        // Si no está logueado, mostrar las opciones de login y registro
        userDropdown.innerHTML = `
            <li class="dropdown-header text-center">
                <a href="login.html">Inicia Sesión</a>
            </li>
            <li class="dropdown-header text-center">
                <a href="register.html">Registrarse</a>
            </li>
        `;
    }
});

// Función para cerrar sesión
function cerrarSesion() {
    // Limpiar el almacenamiento y redirigir a la página principal
    localStorage.removeItem('usuarioActual');
    sessionStorage.removeItem('isLoggedIn');
    
    // Actualizar el dropdown para mostrar las opciones de login
    const userDropdown = document.getElementById('user-dropdown');
    userDropdown.innerHTML = `
        <li class="dropdown-header text-center">
            <a href="login.html">Inicia Sesión</a>
        </li>
        <li class="dropdown-header text-center">
            <a href="register.html">Registrarse</a>
        </li>
    `;
}
