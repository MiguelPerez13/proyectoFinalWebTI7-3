import * as firebaseService from './services/firebaseService.js';
import { cloudinaryService } from './services/cloudinaryService.js';

// Variables DOM
const btnNew = document.getElementById('btnNew');
const tbody = document.getElementById('tbody');
const cancelBtn = document.getElementById('cancel');
const submitBtn = document.getElementById('submitBtn');
const imgInput = document.getElementById('img');



let id = 0;
let nombre = '';
let descripcion = '';
let precio = 0;
let imagen = '';

const leerIputs = () => {
    id = document.getElementById('itemId').value;
    if(!id){
        id = Date.now() + Math.random().toString(16).slice(2);
    }
    nombre = document.getElementById('name').value;
    descripcion = document.getElementById('descripcion').value;
    precio = parseFloat(document.getElementById('precio').value);
};

const limpiarFormulario = () => {
    document.getElementById('form').reset();
    id = 0;
    nombre = '';
    precio = 0;
    imagen = '';
};

const agregarProducto = async () => {
    leerIputs();

    if (!nombre || isNaN(precio) || !imagen || !descripcion) {
        alert('Por favor, complete todos los campos correctamente');
        return;
    }

    try {
        const product = {
            id,
            nombre,
            descripcion,
            precio,
            imagen
        };

        const result = await firebaseService.databaseService.insertProduct(product);
        if (result.success) {
            alert(result.message);
            cerrarFormulario();
            cargarProductos();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error al agregar producto:', error);
        alert('Ocurrió un error al agregar el producto');
    }
};

const cargarProductos = async () => {
    let productos = firebaseService.databaseService.getAllProducts();
    productos = (await productos).data;
    tbody.innerHTML = '';

    Object.values(productos).forEach((producto) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.descripcion}</td>
            <td>${producto.precio}</td>
            <td><img src="${producto.imagen}" alt="${producto.nombre}" width="50" class="imgProducto"/></td>
            <td>
                <button class="btn editar" data-id="${producto.id}">Editar</button>
                <button class="btn eliminar" data-id="${producto.id}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
        const editarBtn = tr.querySelector('.editar');
        const eliminarBtn = tr.querySelector('.eliminar');

        editarBtn.addEventListener('click', () => {
            document.getElementById('modalForm').classList.remove('hidden');
            document.getElementById('itemId').value = producto.id;
            document.getElementById('name').value = producto.nombre;
            document.getElementById('descripcion').value = producto.descripcion;
            document.getElementById('precio').value = producto.precio;
            imagen = producto.imagen;
        });

        eliminarBtn.addEventListener('click', async () => {
            const confirmDelete = confirm('¿Está seguro de que desea eliminar este producto?');
            if (confirmDelete) {
                const result = await firebaseService.databaseService.deleteProduct(producto.id);
                if (result.success) {
                    alert(result.message);
                    cargarProductos();
                } else {
                    alert(result.message);
                }
            }
        });
    });
}

const cerrarFormulario = () => {
    document.getElementById('modalForm').classList.add('hidden');
};

btnNew.addEventListener('click', () => {
    limpiarFormulario();
    document.getElementById('modalForm').classList.remove('hidden');
});

cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cerrarFormulario();
});

imgInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const result = await cloudinaryService.uploadImage(file);
        if (result.success) {
            imagen = result.url;
            
        }
        alert(result.message);
    }
});

submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await agregarProducto();
});

// Cargar productos al iniciar
cargarProductos();