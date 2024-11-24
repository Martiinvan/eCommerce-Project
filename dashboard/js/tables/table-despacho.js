document.addEventListener('DOMContentLoaded', function(){
    let table = $('#usuariosTable').DataTable({
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
                        <button class="btn btn-sm btn-primary" onclick="editarUsuario(${row.id}, '${row.idusuario}', '${row.emailusuario}', '${row.idproducto}', '${row.nombreproducto}', '${row.cantidad}', '${row.fecha}', '${rowdespachado}')">
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
})