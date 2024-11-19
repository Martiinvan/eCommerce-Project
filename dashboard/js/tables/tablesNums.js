
// FUNCIONES PARA FETCH

// USUARIOS
function users() {
    return fetch('https://673b7874339a4ce4451c54ba.mockapi.io/Usuario')
        .then(response => response.json())
        .then(data => {
            const cantidadClaves = Object.keys(data).length; // Cuenta las claves del objeto
            console.log('Cantidad de claves:', cantidadClaves);
            return cantidadClaves;
        })
        .catch(error => {
            console.log('Error:', error);
            return 0; // Retorna 0 en caso de error
        });
}
// PRODUCTOS
function product() {
    return fetch('https://673bca8896b8dcd5f3f77b33.mockapi.io/Producto')
        .then(response => response.json())
        .then(data => {
            const cantidadProductos = Object.keys(data).length;
            console.log('Cantidad de Productos:', cantidadProductos);
            return cantidadProductos;
        })
        .catch(error => {
            console.log('Error:', error);
            return 0; // Retorna 0 en caso de error
        });
}



// LLAMAMOS A LOS SPAN
const numUsu = document.querySelector('.num-usu');
const numProd = document.querySelector('.num-prod')
// MODIFICAMOS EL CONTENIDO DEL SPAN
users().then(cantidad => {
    numUsu.textContent = cantidad;
});
product().then(cantidad => {
    numProd.textContent = cantidad;
})