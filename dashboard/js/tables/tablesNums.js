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

// LLAMAMOS AL SPAN
const numUsu = document.querySelector('.num-usu');

// MODIFICAMOS EL CONTENIDO DEL SPAN DE FORMA ASINCRÓNICA
users().then(cantidad => {
    numUsu.textContent = cantidad;
});