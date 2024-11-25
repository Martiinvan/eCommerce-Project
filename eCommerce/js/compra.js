// Pasamos los datos de la compra a una api
const confirmarCompra = document.getElementById('confirmarCompra');
confirmarCompra.addEventListener('click', (e) => {
    e.preventDefault();
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const nuevaVenta = {
        id: carrito.length + 1,
        idUsuario: usuarioActual.id,
        comprador: usuarioActual.name + ' ' + usuarioActual.apellido,
        emailUsuario: usuarioActual.email,
        fecha: new Date(),
        despachado: 'Sin despachar',
        productos: carrito.map(producto => {
            return {
                id: producto.id,
                name: producto.name,
                quantity: producto.quantity,
                price: producto.price,
            };

        }),
    };

    fetch('https://6742ade3b7464b1c2a626fd7.mockapi.io/Venta', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaVenta),
    })
        .then(response => response.json())
        .then(venta => {
            console.log('Venta creada:', venta);
            localStorage.removeItem('carrito');
            Swal.fire({
                icon: 'success',
                title: 'Compra realizada',
                showConfirmButton: false,
                timer: 1500
            });
            mostrarCarrito();
        })
        .catch(error => {
            console.error('Error al crear la venta:', error);
        });
})
// Funcion para limpiar el carrito
const limpiarCarrito = () => localStorage.removeItem('carrito');

// funcion para mostrar los productos del carrito
    const mostrarCarrito = () => {
        const carritoConteiner = document.getElementById('carritoConteiner');
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        let html = '';
        let contador = 0;
    
        carrito.forEach(producto => {
            html += `
                <div class="d-flex justify-content-center align-items-center">
                    <div class="card mb-3" style="max-width: 300px;">
                        <div class="row g-0">
                            <div class="col-md-4">
                                <img src="${producto.img}" class="img-fluid rounded-start" alt="...">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <p class="card-title">${producto.name.substring(0, 17) + '...'}</p>
                                    <p class="card-text">Cantidad: ${producto.quantity}</p>
                                    <p class="card-text">Precio: ${producto.price}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            contador += producto.quantity;
        });
    
        carritoConteiner.innerHTML = html;
        document.getElementById('carrito-count').textContent = contador;
    }

    const vaciarCarritoButton = document.getElementById('vaciarCarrito');
    vaciarCarritoButton.addEventListener('click', e => {
        e.preventDefault();
        limpiarCarrito();
        mostrarCarrito();
    });
    mostrarCarrito();