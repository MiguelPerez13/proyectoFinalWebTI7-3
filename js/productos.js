import * as firebaseService from './services/firebaseService.js';

document.addEventListener('DOMContentLoaded', async() =>
    {
        //vemos si el firebase anda funcionando
        const res=await firebaseService.databaseService.getAllProducts()
        try
        {
            if (res.success)
            {
                //cargo el div que hice en el html de los productos
                const contenedorProductos = document.getElementById('productos');
                const productos=res.data
                const listaDeProductos = Object.values(productos);

                //se crean cada dic con su info de producto
                listaDeProductos.forEach(producto =>
                {
                    const productoIndividual=document.createElement('div')
                    productoIndividual.classList.add('producto')
                    productoIndividual.innerHTML=`
                        <h3>${producto.nombre}</h3>
                        <img src=${producto.imagen} width="100" >
                        <button data-id="${producto.id}">Mas Informacion</button>
                    `
                    contenedorProductos.appendChild(productoIndividual)
                    
                })

            //esto lo que hace es que cada boton tiene un id que hace que lo mande por el url para cargar la pagina segun su id
            contenedorProductos.addEventListener('click', (boton) => 
            {

                if (boton.target.dataset.id)
                {
                    const productoId = boton.target.dataset.id;
                    window.location.href = `detalle.html?id=${productoId}`;
                }
            });

            }
            //si el firebase no responde
            else
            {
                document.body.innerHTML='<h1>Estamos sufriendo problemas tecnicos</h1>'
                alert('Error Al cargar los productos')
            }
        }
        //si pasa algun otro error inesperado
        catch(error)
        {
            alert('Ha sucedido un error vuelva mas tarde')

        }
    })