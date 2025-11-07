import * as firebaseService from './services/firebaseService.js';

document.addEventListener('DOMContentLoaded', async ()=>
{
    const contenedorProducto = document.getElementById('detalleProducto');

    //Esto lo que hace es leer el id que se le paso a la pagina a la hora de picarle a mas informacion
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const idProducto = urlParams.get('id');

    const res=await firebaseService.databaseService.getProduct(idProducto)

    if(res.success)
    {
        const producto=res.data

        //en las imagenes 2 y 3 se ecriben asi para que se cargen en dicho caso de que si existan. si no Existen no se cargan
        contenedorProducto.innerHTML=`
                <h2>${producto.nombre}</h2>
                <img src="${producto.imagen}" alt="${producto.nombre}" width="300">
                
                ${producto.imagen2 ? `<img src="${producto.imagen2}" width="200">` : ''}
                ${producto.imagen3 ? `<img src="${producto.imagen3}" width="200">` : ''}
                
                <p><strong>Descripción:</strong> ${producto.descripcion}</p>
                <p><strong>Precio:</strong> $${producto.precio}</p>
            `
    }
    else
    {
        contenedorProducto.innerHTML='<h2>no se encontro el producto</h2>'
    }
})