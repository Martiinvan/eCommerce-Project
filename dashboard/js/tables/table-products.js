
const PRODUCT_API_URL = 'https://673bca8896b8dcd5f3f77b33.mockapi.io/Producto';
const CATEGORY_API_URL = 'https://673b7874339a4ce4451c54ba.mockapi.io/Categoria';
const tableBody = document.querySelector('#productoTable tbody');
const loadingDiv = document.querySelector('.loading');

// estuve renegando media hora xq no defini antes la categoria como variable global la concha de su madre
let categories = [];

// DOM
document.addEventListener('DOMContentLoaded', async () => {
    await loadCategories();
    loadProductData();
});

// Fetch de categorias
async function loadCategories() {
    try {
        const response = await fetch(CATEGORY_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        categories = await response.json();
    } catch (error) {
        console.error('Error loading categories:', error);
        showError('Error al cargar las categorías');
    }
}

// llamamos al html para cambiar unas cositas
function createCategorySelectHtml(selectedCategoryId = '') {
    const options = categories.map(category => 
        `<option value="${category.id}" ${category.id === selectedCategoryId ? 'selected' : ''}>
            ${category.name}
        </option>`
    ).join('');
    
    return `
        <select id="categoria" class="swal2-input">
            <option value="">Selecciona una categoría</option>
            ${options}
        </select>
    `;
}

// cargamos la data de los productos vos sabes perro
async function loadProductData() {
    try {
        showLoading(true);
        const response = await fetch(PRODUCT_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        renderTable(products);
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Error al cargar los datos');
    } finally {
        showLoading(false);
    }
}

// conseguimos el nombre y la id de la cateogira
function getCategoryName(categoryId) {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'No asignada';
}

// asi se renderiza una tabla agucho pelotudo
function renderTable(products) {
    tableBody.innerHTML = '';
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${getCategoryName(product.categoria)}</td>
            <td>
                <img src="${product.img}" alt="${product.name}" style="max-width: 50px; max-height: 50px;">
            </td>
            <td>${product.descripcion}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editProduct(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id}, '${product.name}')">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

//  loading cambiar a none para q no se vea xd
function showLoading(show) {
    loadingDiv.style.display = show ? 'block' : 'none';
}

// errores
function showError(message) {
    Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: message,
        confirmButtonColor: '#3085d6'
    });
}

// editar producto
function editProduct(product) {
    Swal.fire({
        title: 'Editar Producto',
        html: `
            <input type="text" id="nombre" class="swal2-input" placeholder="Nombre" value="${product.name}">
            <input type="number" id="price" class="swal2-input" placeholder="Precio" value="${product.price}">
            ${createCategorySelectHtml(product.categoria)}
            <input type="text" id="img" class="swal2-input" placeholder="URL de Imagen" value="${product.img}">
            <textarea id="descripcion" class="swal2-textarea" placeholder="Descripción">${product.descripcion}</textarea>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        preConfirm: () => {
            const data = {
                name: document.getElementById('nombre').value,
                price: document.getElementById('price').value,
                categoria: document.getElementById('categoria').value,
                img: document.getElementById('img').value,
                descripcion: document.getElementById('descripcion').value
            };
            
            if (!data.name || !data.price || !data.img || !data.descripcion) {
                Swal.showValidationMessage('Por favor complete todos los campos requeridos');
                return false;
            }
            return data;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            updateProduct(product.id, result.value);
        }
    });
}

// funcion para subir el producto
async function updateProduct(id, data) {
    try {
        const response = await fetch(`${PRODUCT_API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Error al actualizar');

        Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'Producto actualizado correctamente',
            showConfirmButton: false,
            timer: 1500
        });

        loadProductData();
    } catch (error) {
        console.error('Error:', error);
        showError('Error al actualizar el producto');
    }
}

// FUNCION PARA BORRAR EL PRODUCTO
function deleteProduct(id, name) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar el producto "${name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`${PRODUCT_API_URL}/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) throw new Error('Error al eliminar');

                Swal.fire({
                    icon: 'success',
                    title: '¡Eliminado!',
                    text: 'El producto ha sido eliminado correctamente',
                    showConfirmButton: false,
                    timer: 1500
                });

                loadProductData();
            } catch (error) {
                console.error('Error:', error);
                showError('Error al eliminar el producto');
            }
        }
    });
}

function agregarProducto() {
    Swal.fire({
        title: 'Agregar Nuevo Producto',
        html: `
            <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
            <input type="number" id="price" class="swal2-input" placeholder="Precio">
            ${createCategorySelectHtml()}
            <input type="text" id="img" class="swal2-input" placeholder="URL de Imagen">
            <textarea id="descripcion" class="swal2-textarea" placeholder="Descripción"></textarea>
        `,
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        preConfirm: () => {
            const data = {
                name: document.getElementById('nombre').value,
                price: document.getElementById('price').value,
                categoria: document.getElementById('categoria').value,
                img: document.getElementById('img').value,
                descripcion: document.getElementById('descripcion').value
            };

            
            if (!data.name || !data.price || !data.img || !data.descripcion) {
                Swal.showValidationMessage('Por favor complete todos los campos requeridos');
                return false;
            }
            return data;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            createProduct(result.value);
        }
    });
}


async function createProduct(data) {
    try {
        const response = await fetch(PRODUCT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Error al agregar el producto');

        Swal.fire({
            icon: 'success',
            title: '¡Producto Agregado!',
            text: 'El producto ha sido agregado correctamente.',
            showConfirmButton: false,
            timer: 1500
        });

        loadProductData();
    } catch (error) {
        console.error('Error:', error);
        showError('Error al agregar el producto');
    }
}
