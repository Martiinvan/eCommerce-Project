document.addEventListener('DOMContentLoaded', function(){
    let table = $('#despachoTable').DataTable({
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        },
        responsive: true,
        pageLength: 10,
        order: [[0, 'desc']],
        columns: [
            { data: 'id' },
            { data: 'idusuario' },
            { data: 'emailusuario' },
            { data: 'idproducto' },
            { data: 'nombreproducto' },
            { data: 'cantidad' },
            { data: 'fecha' },
            { data: 'despachado' },
            {
                data: null,
                render: function(data, type, row) {
                    return `
                        <button class="btn btn-sm btn-primary" onclick="editarDespacho(${row.id}, '${row.idusuario}', '${row.emailusuario}', '${row.idproducto}', '${row.nombreproducto}', '${row.cantidad}', '${row.fecha}', '${row.despachado}')">

                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarDespacho(${row.id}, '${row.name}')">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    `;
                }
            }
        ]
    });
    cargarDatos(table);
})

async function cargarDatos(table) {
    try {
        const response = await fetch('https://6742ade3b7464b1c2a626fd7.mockapi.io/Venta');
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


function editarDespacho(id, idusuario, emailusuario, idproducto, nombreproducto, cantidad, fecha, despachado) {
    Swal.fire({
        title: 'Editar Despacho',
        html: `
            <input type="number" id="idusuario" class="swal2-input" placeholder="Id usuario" value="${idusuario}">
            <input type="email" id="emailusuario" class="swal2-input" placeholder="Email usuario" value="${emailusuario}">
            <input type="number" id="idproducto" class="swal2-input" placeholder="Id producto" value="${idproducto}">
            <input type="text" id="nombreproducto" class="swal2-input" placeholder="Nombre producto" value="${nombreproducto}">
            <input type="number" id="cantidad" class="swal2-input" placeholder="Ciudad" value="${cantidad}">
            <input type="datetime" id="fecha" class="swal2-input" placeholder="Fecha" value="${fecha}">
            
            <div class="swal2-input">
                <label for="despachado">Estado</label>
                <select id="despachado" class="swal2-input">
                    <option value="Despachado" ${despachado === 'Despachado' ? 'selected' : ''}>Despachado</option>
                    <option value="Sin despachar" ${despachado === 'sin despachar' ? 'selected' : ''}>Sin despachar</option>
                </select>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        focusConfirm: false,
        preConfirm: async () => {
            const idusuario = document.getElementById('idusuario').value;
            const emailusuario = document.getElementById('emailusuario').value;
            const idproducto = document.getElementById('idproducto').value;
            const nombreproducto = document.getElementById('nombreproducto').value;
            const cantidad = document.getElementById('cantidad').value;
            const fecha = document.getElementById('fecha').value;
            const despachado = document.getElementById('despachado').value;

            if (!idusuario || !emailusuario || !idproducto || !nombreproducto || !cantidad || !fecha || !despachado) {
                Swal.showValidationMessage('Por favor llena todos los campos');
                return false;
            }


            return { idusuario, emailusuario, idproducto, nombreproducto, cantidad, fecha, despachado};
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Llamamos a la función para actualizar el usuario con los datos obtenidos
            actualizardespacho(id, result.value.idusuario, result.value.emailusuario, result.value.idproducto, result.value.nombreproducto, result.value.cantidad, result.value.fecha, result.value.despachado);
        }
    });
}

async function actualizardespacho(id, idusuario, emailusuario,idproducto,nombreproducto,cantidad,fecha,despachado) {
    try {
        const response = await fetch(`https://6742ade3b7464b1c2a626fd7.mockapi.io/Venta/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idusuario: idusuario,
                emailusuario: emailusuario,
                idproducto:idproducto ,
                nombreproducto :nombreproducto ,
                cantidad: cantidad,
                fecha:fecha,
                despachado:despachado   
            })
        });

        if (!response.ok) throw new Error('Error al actualizars');

        Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'Venta actualizado correctamente',
            showConfirmButton: false,
            timer: 1500
        });

        cargarDatos($('#despachoTable').DataTable()); 

    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al actualizar la venta');
    }
}

// Función para eliminar usuario
function eliminarDespacho(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar esta Venta ${id}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // eliminamos en el fetch 
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
                    text: 'La venta ha sido eliminado correctamente.',
                    showConfirmButton: false,
                    timer: 1500
                });
                // se recarga la tabla
                cargarDatos($('#despachoTable').DataTable());
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarError('Error al eliminar la venta');
            });
        }
    });
}