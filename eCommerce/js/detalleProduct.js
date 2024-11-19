// CONSEGUIMOS LA ID DEL PRODUCTO EN LA URL

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');



// Realizar el fetch para obtener los datos de los productos
fetch('https://673bca8896b8dcd5f3f77b33.mockapi.io/Producto')
    .then(response => response.json()) // conver a json
    .then(products => {
        // buscamos el producto por su id
        const product = products.find(p => p.id === productId);
        if(product) {
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