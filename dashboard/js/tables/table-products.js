document.addEventListener("DOMContentLoaded", function(){
    let table = $('#productoTable').DataTable({
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        },
        responsive: true,
        pageLength: 10,
        order: [[0, 'desc']],
        columns: [
            { data: 'id' },
            { data: 'name' },
            { data: 'price' },
            { data: 'img' },
            { data: 'descripcion'},
            {
                data: null,
                render: function(data, type, row) {
                    return `
                        <button class="btn btn-sm btn-primary" onclick="editarUsuario(${row.id}, '${row.name}', '${row.price}','${row.img}','${row.descripcion}')">
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

    cargarDatos(table);
});

async function cargarDatos(table) {
    try {
        const response = await fetch('https://673bca8896b8dcd5f3f77b33.mockapi.io/Producto');
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

function mostrarError(mensaje) {
    Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: mensaje,
        confirmButtonColor: '#3085d6'
    });
}

function editarProducto(id, nombre, price,img,descripcion) {
    Swal.fire({
        title: 'Editar Producto',
        html: `
            <input type="text" id="nombre" class="swal2-input" placeholder="Nombre" value="${nombre}">
            <input type="price" id="price" class="swal2-input" placeholder="Price" value="${price}">
            <input type="text" id="img" class="swal2-input" placeholder="Imagen" value="${img}">
            <input type="price" id="descripcion" class="swal2-input" placeholder="Descripcion" value="${descripcion}">
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        focusConfirm: false,
        preConfirm: () => {
            const nombre = document.getElementById('nombre').value;
            const price = document.getElementById('price').value;
            const img = document.getElementById('img').value;
            const descripcion = document.getElementById('descripcion').value;
            if (!nombre || !price || !img || !descripcion) {
                Swal.showValidationMessage('Por favor llena todos los campos');
                return false;
            }
            return { nombre, price, img, descripcion};
        }
    }).then((result) => {
        if (result.isConfirmed) {
            actualizarUsuario(id, result.value.nombre, result.value.price , result.value.img, result.value.descripcion);
        }
    });
}

function eliminarProducto(id, nombre) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar el producto ${nombre}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // eliminamos en el fetch 
            fetch(`https://673bca8896b8dcd5f3f77b33.mockapi.io/Producto/${id}`, {
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
                cargarDatos($('#productoTable').DataTable());
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarError('Error al eliminar el usuario');
            });
        }
    });
}

async function actualizarProducto(id, nombre, price,img,descripcion,categoria) {
    try {
        const response = await fetch(`https://673bca8896b8dcd5f3f77b33.mockapi.io/Producto/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: nombre,
                price: price,
                categoria : categoria,
                img: img,
                descripcion : descripcion,
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
