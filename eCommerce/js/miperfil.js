document.addEventListener('DOMContentLoaded', () => {
    // Verificar si el usuario está logueado
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual')) || {};
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

    // Si no hay usuario logueado, redirigir al login
    if (!isLoggedIn || !usuarioActual.name) {
        Swal.fire({
            icon: 'warning',
            title: 'No has iniciado sesión',
            text: 'Por favor, inicia sesión para acceder a esta sección.',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            window.location.href = 'login.html';
        });
        return;
    }

    // Referencia al contenedor del perfil
    const miperfilin = document.getElementById('miperfilcontent');

    // Construcción dinámica del perfil
    miperfilin.innerHTML = `
        <div class="col-lg-4 card" style="width: 36%;">
            <div class="card mb-4">
                <div class="card-body text-center">
                    <img src="${usuarioActual.avatar || 'path/to/default-avatar.png'}"
                        alt="avatar" class="rounded-circle img-fluid" style="width: 150px;">
                    <h5 class="my-3">${usuarioActual.name}</h5>
                    <p class="text-muted mb-1">${usuarioActual.role || 'Rol no especificado'}</p>
                    <p class="text-muted mb-4">${usuarioActual.city || 'Ciudad no especificada'}, ${usuarioActual.country || 'País no especificado'}</p>
                    <div class="d-flex justify-content-center mb-2">
                        <button type="button" data-mdb-button-init data-mdb-ripple-init
                            class="btn btn-primary">Editar Perfil</button>
                    </div>
                </div>
            </div>
            <div class="card mb-4 mb-lg-0">
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-3">
                            <p class="mb-0">Nombre</p>
                        </div>
                        <div class="col-sm-9">
                            <p class="text-muted mb-0">${usuarioActual.name}, ${usuarioActual.apellido} </p>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-sm-3">
                            <p class="mb-0">Email</p>
                        </div>
                        <div class="col-sm-9">
                            <p class="text-muted mb-0">${usuarioActual.email || 'Email no especificado'}</p>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-sm-3">
                            <p class="mb-0">Teléfono</p>
                        </div>
                        <div class="col-sm-9">
                            <p class="text-muted mb-0">${usuarioActual.phone || 'Teléfono no especificado'}</p>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-sm-3">
                            <p class="mb-0">Dirección</p>
                        </div>
                        <div class="col-sm-9">
                            <p class="text-muted mb-0">${usuarioActual.address || 'Dirección no especificada'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
});
