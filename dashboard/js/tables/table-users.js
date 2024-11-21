document.addEventListener('DOMContentLoaded', function() {
    let table = $('#usuariosTable').DataTable({
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        },
        responsive: true,
        pageLength: 10,
        order: [[0, 'desc']],
        columns: [
            { data: 'id' },
            { data: 'name' },
            { data: 'email' },
            {
                data: null,
                render: function(data, type, row) {
                    return `
                        <button class="btn btn-sm btn-primary" onclick="editarUsuario(${row.id}, '${row.name}', '${row.apellido}', '${row.email}', '${row.phone}', '${row.avatar}', '${row.city}', '${row.country}', '${row.role}')">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${row.id}, '${row.name}')">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    `;
                }
            }
        ]
    });

    // Usamos fetch en esta función
    cargarDatos(table);
});

async function cargarDatos(table) {
    try {
        const response = await fetch('https://673b7874339a4ce4451c54ba.mockapi.io/Usuario');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const datos = await response.json();
        // limpia  y vuelve a cargar los datos
        table.clear();
        table.rows.add(datos);
        table.draw();
        
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        mostrarError('Error al cargar los datos');
    }
}

// MUESTRA ERRORES
function mostrarError(mensaje) {
    Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: mensaje,
        confirmButtonColor: '#3085d6'
    });
}

function editarUsuario(id, nombre, apellido, email, telefono, avatar, ciudad, pais, rol) {
    Swal.fire({
        title: 'Editar Usuario',
        html: `
            <input type="text" id="nombre" class="swal2-input" placeholder="Nombre" value="${nombre}">
            <input type="text" id="apellido" class="swal2-input" placeholder="Apellido" value="${apellido}">
            <input type="email" id="email" class="swal2-input" placeholder="Email" value="${email}">
            <input type="tel" id="telefono" class="swal2-input" placeholder="Teléfono" value="${telefono}">
            <input type="text" id="ciudad" class="swal2-input" placeholder="Ciudad" value="${ciudad}">
            <input type="text" id="pais" class="swal2-input" placeholder="País" value="${pais}">
            
            <!-- Campo para elegir rol -->
            <div class="swal2-input">
                <label for="rol">Rol</label>
                <select id="rol" class="swal2-input">
                    <option value="Administrador" ${rol === 'Administrador' ? 'selected' : ''}>Administrador</option>
                    <option value="Cliente" ${rol === 'Cliente' ? 'selected' : ''}>Cliente</option>
                </select>
            </div>

            <!-- Campo para subir imagen -->
            <input type="file" id="avatar" class="swal2-input" placeholder="Avatar">
            <div id="avatarPreview" style="margin-top: 10px;">
                <img src="${avatar}" alt="Avatar" width="50" height="50" class="img-circle">
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        focusConfirm: false,
        preConfirm: async () => {
            const nombre = document.getElementById('nombre').value;
            const apellido = document.getElementById('apellido').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;
            const ciudad = document.getElementById('ciudad').value;
            const pais = document.getElementById('pais').value;
            const rol = document.getElementById('rol').value;  // Obtener el valor del rol
            const avatarFile = document.getElementById('avatar').files[0]; // Obtener la imagen cargada

            if (!nombre || !apellido || !email || !telefono || !ciudad || !pais || !rol) {
                Swal.showValidationMessage('Por favor llena todos los campos');
                return false;
            }

            let avatarURL = avatar; // Mantener el avatar actual si no se selecciona uno nuevo
            if (avatarFile) {
                // Subir la imagen a ImgBB
                const formData = new FormData();
                formData.append("image", avatarFile);

                try {
                    const response = await fetch('https://api.imgbb.com/1/upload?key=f7fab0663fcc750cd272f35713d1a15b', {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();
                    if (result.success) {
                        avatarURL = result.data.url; // Si la imagen se sube correctamente, obtenemos la URL
                    } else {
                        throw new Error('Error al subir la imagen');
                    }
                } catch (error) {
                    Swal.showValidationMessage('Error al subir la imagen');
                    console.error('Error al subir la imagen:', error);
                    return false;
                }
            }

            return { nombre, apellido, email, telefono, avatar: avatarURL, ciudad, pais, rol };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Llamamos a la función para actualizar el usuario con los datos obtenidos
            actualizarUsuario(id, result.value.nombre, result.value.apellido, result.value.email, result.value.telefono, result.value.avatar, result.value.ciudad, result.value.pais, result.value.rol);
        }
    });
}

// Función para eliminar usuario
function eliminarUsuario(id, nombre) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar al usuario ${nombre}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // eliminamos en el fetch 
            fetch(`https://673b7874339a4ce4451c54ba.mockapi.io/Usuario/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) throw new Error('Error al eliminar');
                return response.json();
            })
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Eliminado!',
                    text: 'El usuario ha sido eliminado correctamente.',
                    showConfirmButton: false,
                    timer: 1500
                });
                // se recarga la tabla
                cargarDatos($('#usuariosTable').DataTable());
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarError('Error al eliminar el usuario');
            });
        }
    });
}

// Actualizar usuario
async function actualizarUsuario(id, nombre, apellido, email, telefono, avatar, ciudad, pais, rol) {
    try {
        const response = await fetch(`https://673b7874339a4ce4451c54ba.mockapi.io/Usuario/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: nombre,
                apellido: apellido,
                email: email,
                phone: telefono,
                avatar: avatar,
                city: ciudad,
                country: pais,
                role: rol 
            })
        });

        if (!response.ok) throw new Error('Error al actualizars');

        Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'Usuario actualizado correctamente',
            showConfirmButton: false,
            timer: 1500
        });

        cargarDatos($('#usuariosTable').DataTable()); 

    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al actualizar el usuario');
    }
}


