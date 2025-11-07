import * as firebaseService from './services/firebaseService.js';

document.addEventListener('DOMContentLoaded', async() =>
    {
        //vemos si el firebase anda funcionando
        const res=await firebaseService.getAllProducts()

        if (res.success)
        {
            const productListContainer = document.getElementById('productList');
            const productos=res.data
            const listaDeProductos = Object.values(productos);
            alert('jola')
        }
        else
        {
            alert('Error Al cargar los productos')
        }
    })