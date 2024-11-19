document.addEventListener('DOMContentLoaded', function () {
    let table = $('#categoryTable').DataTable({
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        },
        responsive: true,
        pageLength: 10,
        order: [[0, 'desc']],
        columns: [
            { data: 'id' },
            { data: 'name' },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-primary" onclick="editarCategoria(${row.id}, '${row.name}')">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarCategoria(${row.id}, '${row.name}')">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    `;
                }
            }
        ]
    });

    cargarDatos(table);
});

async function cargarDatos(table) {
    try {
        const response = await fetch('https://673b7874339a4ce4451c54ba.mockapi.io/Categoria');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const datos = await response.json();
        table.clear();
        table.rows.add(datos);
        table.draw();
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        mostrarError('Error al cargar los datos');
    }
}

function mostrarError(mensaje) {
    Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: mensaje,
        confirmButtonColor: '#3085d6'
    });
}

function editarCategoria(id, nombre) {
    Swal.fire({
        title: 'Editar Categoría',
        html: `
            <input type="text" id="nombre" class="swal2-input" placeholder="Nombre" value="${nombre}">
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        focusConfirm: false,
        preConfirm: () => {
            const nombre = document.getElementById('nombre').value;
            if (!nombre) {
                Swal.showValidationMessage('Por favor llena todos los campos');
                return false;
            }
            return { nombre };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            actualizarCategoria(id, result.value.nombre);
        }
    });
}

function eliminarCategoria(id, nombre) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar la categoría ${nombre}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`https://673b7874339a4ce4451c54ba.mockapi.io/Categoria/${id}`, {
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
                        text: 'La categoría ha sido eliminada correctamente.',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    cargarDatos($('#categoryTable').DataTable());
                })
                .catch(error => {
                    console.error('Error:', error);
                    mostrarError('Error al eliminar la categoría');
                });
        }
    });
}

async function actualizarCategoria(id, nombre) {
    try {
        const response = await fetch(`https://673b7874339a4ce4451c54ba.mockapi.io/Categoria/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: nombre })
        });

        if (!response.ok) throw new Error('Error al actualizar');

        Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'Categoría actualizada correctamente.',
            showConfirmButton: false,
            timer: 1500
        });

        cargarDatos($('#categoryTable').DataTable());
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al actualizar la categoría');
    }
}

function agregarCategoria() {
    Swal.fire({
        title: 'Agregar Nueva Categoría',
        html: `
            <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
        `,
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        focusConfirm: false,
        preConfirm: () => {
            const nombre = document.getElementById('nombre').value;
            if (!nombre) {
                Swal.showValidationMessage('Por favor llena todos los campos');
                return false;
            }
            return { nombre };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            crearCategoria(result.value.nombre);
        }
    });
}

function agregarCategoria() {
    Swal.fire({
        title: 'Agregar Nueva Categoría',
        html: `
            <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
        `,
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        focusConfirm: false,
        preConfirm: () => {
            const nombre = document.getElementById('nombre').value;
            if (!nombre) {
                Swal.showValidationMessage('Por favor llena todos los campos');
                return false;
            }
            return { nombre };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            crearCategoria(result.value.nombre);
        }
    });
}

async function crearCategoria(nombre) {
    try {
        const response = await fetch('https://673b7874339a4ce4451c54ba.mockapi.io/Categoria', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: nombre })
        });

        if (!response.ok) throw new Error('Error al agregar la categoría');

        Swal.fire({
            icon: 'success',
            title: '¡Categoría Agregada!',
            text: 'La categoría se ha agregado correctamente.',
            showConfirmButton: false,
            timer: 1500
        });

        // Recarga los datos de la tabla
        cargarDatos($('#categoryTable').DataTable());

    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al agregar la categoría');
    }
}
