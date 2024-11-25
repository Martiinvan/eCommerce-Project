document.addEventListener('DOMContentLoaded', function () {
    const table = $('#despachoTable').DataTable({
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        },
        responsive: true,
        pageLength: 10,
        order: [[0, 'desc']],
        columns: [
            { data: 'id' },
            { data: 'idUsuario' },
            { data: 'emailUsuario' },
            {
                data: null,
                render: function (data, type, row) {
                    if (!row.productos || !Array.isArray(row.productos)) {
                        return 'No hay productos';
                    }
                    
                    return row.productos.map(producto => `
                        <div class="producto-item">
                            <p><strong>ID:</strong> ${producto.id}</p>
                            <p><strong>Nombre:</strong> ${producto.name}</p>
                            <p><strong>Cantidad:</strong> ${producto.quantity}</p>
                            <hr>
                        </div>
                    `).join('');
                }
            },
            { data: 'fecha' },
            { data: 'despachado' },
            {
                data: null,
                render: function (data, type, row) {
                    // Escapamos los productos para que no cause problemas al pasarlos
                    const productosString = encodeURIComponent(JSON.stringify(row.productos));
                    
                    return `
                        <button class="btn btn-sm btn-primary" onclick="editarDespacho('${row.id}', '${row.idUsuario}', '${row.emailUsuario}', '${productosString}', '${row.fecha}', '${row.despachado}')">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarDespacho(${row.id})">
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
        const response = await fetch('https://6742ade3b7464b1c2a626fd7.mockapi.io/Venta');
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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

function editarDespacho(id, idUsuario, emailUsuario, productosString, fecha, despachado) {
    // Decodificamos los productos
    const productos = JSON.parse(decodeURIComponent(productosString));

    Swal.fire({
        title: 'Editar Despacho',
        html: `
            <div class="swal2-input">
                <label for="despachado">Estado</label>
                <select id="despachado" class="swal2-input">
                    <option value="Despachado" ${despachado === 'Despachado' ? 'selected' : ''}>Despachado</option>
                    <option value="Sin despachar" ${despachado === 'Sin despachar' ? 'selected' : ''}>Sin despachar</option>
                </select>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        focusConfirm: false,
        preConfirm: () => {
            const nuevoDespachado = document.getElementById('despachado').value;
            if (!nuevoDespachado) {
                Swal.showValidationMessage('Por favor selecciona un estado válido');
                return false;
            }
            return { despachado: nuevoDespachado };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Aquí pasamos result.value.despachado en lugar de despachado
            actualizardespacho(id, idUsuario, emailUsuario, productos, fecha, result.value.despachado);
        }
    });
}

async function actualizardespacho(id, idUsuario, emailUsuario, productos, fecha, despachado) {
    try {
        // Primero obtenemos los datos actuales para no perder información
        const getResponse = await fetch(`https://6742ade3b7464b1c2a626fd7.mockapi.io/Venta/${id}`);
        const currentData = await getResponse.json();

        const response = await fetch(`https://6742ade3b7464b1c2a626fd7.mockapi.io/Venta/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...currentData,  // Mantenemos todos los datos actuales
                idUsuario: idUsuario,
                emailUsuario: emailUsuario,
                productos: productos,
                fecha: fecha,
                despachado: despachado  // Actualizamos el estado
            })
        });

        if (!response.ok) throw new Error('Error al actualizar la venta');

        Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'Venta actualizada correctamente',
            showConfirmButton: false,
            timer: 1500
        });

        cargarDatos($('#despachoTable').DataTable());
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al actualizar la venta');
    }
}
async function actualizardespacho(id, idUsuario, emailUsuario, productos, nombreProducto, cantidad, fecha, despachado) {
    try {
        // Los productos ya deberían ser un objeto, no necesitas parsearlo
        const response = await fetch(`https://6742ade3b7464b1c2a626fd7.mockapi.io/Venta/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idUsuario: idUsuario,
                emailUsuario: emailUsuario,
                productos: productos, // Aquí productos ya es un array de objetos
                nombreProducto: nombreProducto,
                cantidad: cantidad,
                fecha: fecha,
                despachado: despachado
            })
        });

        if (!response.ok) throw new Error('Error al actualizar la venta');

        Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'Venta actualizada correctamente',
            showConfirmButton: false,
            timer: 1500
        });

        cargarDatos($('#despachoTable').DataTable());
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al actualizar la venta');
    }
}

function eliminarDespacho(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar la venta con ID ${id}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`https://6742ade3b7464b1c2a626fd7.mockapi.io/Venta/${id}`, {
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
                        text: 'La venta ha sido eliminada correctamente.',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    cargarDatos($('#despachoTable').DataTable());
                })
                .catch(error => {
                    console.error('Error:', error);
                    mostrarError('Error al eliminar la venta');
                });
        }
    });
}
