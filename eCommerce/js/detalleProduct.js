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
        price: document.getElementById('priceprod').textContent.replace('$', ''),
        img: document.getElementById('imgprod').src,
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
    mostrarCarrito();

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
