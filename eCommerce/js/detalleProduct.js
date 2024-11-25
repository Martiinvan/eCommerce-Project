// CONSEGUIMOS LA ID DEL PRODUCTO EN LA URL

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');



// Realizar el fetch para obtener los datos de los productos
fetch('https://673bca8896b8dcd5f3f77b33.mockapi.io/Producto')
    .then(response => response.json()) // conver a json
    .then(products => {
        // buscamos el producto por su id
        const product = products.find(p => p.id === productId);
        if (product) {
            console.log(product);
        }
        if (product) {
            document.getElementById('titleprod').textContent = product.name;
            document.getElementById('priceprod').textContent = `${(product.price)}`;
            document.getElementById('desprod').textContent = product.descripcion;
            document.getElementById('imgprod').src = product.img;
        } else {
            console.log('Producto no encontrado');
        }
    })
    .catch(error => {
        console.error('Error al cargar los productos:', error);
    });



const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

// creamos el carrito en el localstorage
function agregarcarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const producto = {
        id: productId,
        idUsuario: usuarioActual.id,
        nombreComprador: usuarioActual.name + ' ' + usuarioActual.apellido,
        emailComprador: usuarioActual.email,
        name: document.getElementById('titleprod').textContent,
        quantity: 1,
        fecha: new Date(),
    }
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    Swal.fire({
        icon: 'success',
        title: 'Producto agregado al carrito',
        showConfirmButton: false,
        timer: 1500
    });
    const carritoCount = document.getElementById('carrito-count');
    carritoCount.textContent = carrito.length;


}


// creamos carrito verificando primero si la sesion esta guardada en el localstorage, si no redirigimos al login
const botonCarrito = document.getElementById('addcart');
botonCarrito.addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.getItem('isLoggedIn') ? agregarcarrito() : Swal.fire({
        icon: 'warning',
        title: 'No has iniciado sesión',
        text: 'Por favor, inicia sesión para acceder a esta sección.',
        confirmButtonText: 'Aceptar'
    });
});

const botonComprar = document.getElementById('')

// Creamos contenido dependiendo cuantos items haya en el carrito
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
        })
        .catch(error => {
            console.error('Error al crear la venta:', error);
        });
})
