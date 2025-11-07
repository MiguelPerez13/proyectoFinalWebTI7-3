import * as firebaseService from './services/firebaseService.js';
import { cloudinaryService } from './services/cloudinaryService.js';

// Variables DOM
const btnNew = document.getElementById('btnNew');
const tbody = document.getElementById('tbody');
const cancelBtn = document.getElementById('cancel');
const submitBtn = document.getElementById('submitBtn');
const imgInputMain = document.getElementById('img');
//agrege esto para que se subieran las otras dos imagens opcionales
const imgInput2 = document.getElementById('img2');
const imgInput3 = document.getElementById('img3');

const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');

// Comprueba si ya hay sesión
const currentUser = () => {
    try {
        return JSON.parse(sessionStorage.getItem('adminUser'));
    } catch {
        return null;
    }
};

// Autenticación simple contra nodo Users en Realtime Database
const authenticate = async (email, password) => {
    const res = await firebaseService.databaseService.getAllUsers();
    if (!res.success) return { success: false, message: 'Error al consultar usuarios' };

    const users = res.data || {};

    // Normalizar entrada
    const inputEmail = String(email).toLowerCase().trim();
    const inputPass = String(password);

    // Normalizar estructura de users: puede ser array con holes o un objeto
    const list = Array.isArray(users) ? users.filter(Boolean) : Object.values(users);

    const found = list.find(u => {
        if (!u) return false;
        const uEmail = u.email ? String(u.email).toLowerCase().trim() : '';
        const uPass = u.password ? String(u.password) : '';
        return uEmail === inputEmail && uPass === inputPass;
    });

    if (found) return { success: true, user: found };
    return { success: false, message: 'Credenciales incorrectas' };
};

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.style.display = 'none';
    const email = loginEmail.value.trim();
    const password = loginPassword.value;
    if (!email || !password) {
        loginError.textContent = 'Ingrese email y contraseña';
        loginError.style.display = 'block';
        return;
    }
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.disabled = true;
    const auth = await authenticate(email, password);
    loginBtn.disabled = false;
    if (auth.success) {
        sessionStorage.setItem('adminUser', JSON.stringify(auth.user));
        loginModal.classList.add('hidden'); // oculta modal login
        // cargar productos ahora que está autenticado
        cargarProductos();
    } else {
        loginError.textContent = auth.message;
        loginError.style.display = 'block';
    }
});

// Antes de cargar productos: si no hay sesión, mostramos modal de login
if (!currentUser()) {
    // mostrar modal y bloquear acceso hasta iniciar sesión
    loginModal.classList.remove('hidden');
} else {
    // ya autenticado
    cargarProductos();
}


let id = 0;
let nombre = '';
let descripcion = '';
let precio = 0;
let imagen = '';
//esto se agrego para que las 2 urls extras de las imagens se leyeran
let imagen2 = ''; 
let imagen3 = '';

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
    imagen2 = ''; 
    imagen3 = '';
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
            imagen,
            imagen2,
            imagen3
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

async function cargarProductos() {
    let productos = await firebaseService.databaseService.getAllProducts();
    productos = productos.data || {};
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
            imagen2 = producto.imagen2;
            imagen3 = producto.imagen3;
            document.getElementById('url1').value = imagen;
            document.getElementById('url2').value = imagen2;
            document.getElementById('url3').value = imagen3;


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

imgInputMain.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const result = await cloudinaryService.uploadImage(file);
        if (result.success) {
            imagen = result.url;
            document.getElementById('url1').value = imagen;
        }
        alert(result.message);
    }
});

imgInput2.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const result = await cloudinaryService.uploadImage(file);
        if (result.success) {
            imagen2 = result.url;
            document.getElementById('url2').value = imagen2;
        }
        alert(result.message);
    }
});

imgInput3.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const result = await cloudinaryService.uploadImage(file);
        if (result.success) {
            imagen3 = result.url;
            document.getElementById('url3').value = imagen3;
        }
        alert(result.message);
    }
});

submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await agregarProducto();
});