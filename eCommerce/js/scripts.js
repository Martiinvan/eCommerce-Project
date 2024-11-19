/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project
// URL de la API o fuente de datos
const apiURL = 'https://673bca8896b8dcd5f3f77b33.mockapi.io/Producto'

// Contenedor donde se agregarán los productos
const productsContainer = document.getElementById('products-container');

// Función para obtener y mostrar los productos
async function loadProducts() {
    try {
        // Hacer la solicitud a la API
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const products = await response.json();

        // Recorrer cada producto y generar el HTML
        products.forEach(product => {
            const productCard = `
                <div class="col mb-5">
                    <div class="card h-100">
                        <!-- Imagen del producto -->
                        <img class="card-img-top" src="${product.img}" alt="${product.name}" />
                        <!-- Detalles del producto -->
                        <div class="card-body p-4">
                            <div class="text-center">
                                <!-- Nombre del producto -->
                                <h5 class="fw-bolder">${product.name}</h5>
                                <!-- Precio del producto -->
                                <p>$${(product.price)}</p>
                            </div>
                        </div>
                        <!-- Botón de acciones -->
                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                            <div class="text-center">
                                <a class="btn btn-outline-dark mt-auto" href="pages/descr-producto.html?id=${product.id}">
                                    Ver detalles
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            productsContainer.innerHTML += productCard;
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        productsContainer.innerHTML = `<p class="text-center text-danger">No se pudieron cargar los productos. Por favor, inténtalo más tarde.</p>`;
    }
}

// Llamar a la función para cargar los productos
loadProducts();