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
                        <button class="btn btn-sm btn-primary" onclick="editarUsuario(${row.id}, '${row.name}', '${row.email}')">
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

    // usamos fetch ene sta funcion
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

// editar usuario
function editarUsuario(id, nombre, email) {
    Swal.fire({
        title: 'Editar Usuario',
        html: `
            <input type="text" id="nombre" class="swal2-input" placeholder="Nombre" value="${nombre}">
            <input type="email" id="email" class="swal2-input" placeholder="Email" value="${email}">
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        focusConfirm: false,
        preConfirm: () => {
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            if (!nombre || !email) {
                Swal.showValidationMessage('Por favor llena todos los campos');
                return false;
            }
            return { nombre, email };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            actualizarUsuario(id, result.value.nombre, result.value.email);
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

async function actualizarUsuario(id, nombre, email) {
    try {
        const response = await fetch(`https://673b7874339a4ce4451c54ba.mockapi.io/Usuario/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: nombre,
                email: email
            })
        });

        if (!response.ok) throw new Error('Error al actualizar');

        Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'Usuario actualizado correctamente',
            showConfirmButton: false,
            timer: 1500
        });

        // recarga la tabla 
        cargarDatos($('#usuariosTable').DataTable());

    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al actualizar el usuario');
    }
}
