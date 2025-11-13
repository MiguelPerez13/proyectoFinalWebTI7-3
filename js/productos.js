import * as firebaseService from './services/firebaseService.js';
import { Categorias } from './categorias.js';




function agregarCajasCategorias(){
    const contenedorProductos = document.getElementById('productos');
    const selectorCattegorias = document.getElementById('categoria');
    for(let i = 0 ; i < Categorias.length ; i++){
        const textoOpcion = (Categorias[i].split("-"))[1];


        const nuevaOpcion = document.createElement("option");
        nuevaOpcion.innerText = textoOpcion;
        nuevaOpcion.value = Categorias[i];
        selectorCattegorias.appendChild(nuevaOpcion);

        
        
        const cajaPrincipalCategoria = document.createElement("div");
        cajaPrincipalCategoria.className = "cajaCategoria";
        cajaPrincipalCategoria.id = Categorias[i];
        const tituloCategoria = document.createElement("h2");
        tituloCategoria.innerText = textoOpcion;
        cajaPrincipalCategoria.appendChild(tituloCategoria)
        cajaPrincipalCategoria.style.display = "none";
        contenedorProductos.appendChild(cajaPrincipalCategoria)

    } 
}


async function listarProductos(){
    const res=await firebaseService.databaseService.getAllProducts()
    if(!res.success){
        console.log("Hubo un errror al intentar obtener los productos");
        return;
    }
    
    let allProducts = res.data


    for (const id in allProducts) {
        
        const producto = allProducts[id];

        const cajaCategoria = document.getElementById(producto.categoria)

        cajaCategoria.style.display = "block";

        const productoIndividual=document.createElement('div');
        productoIndividual.classList.add('producto');
        productoIndividual.innerHTML=`
            <h3>${producto.nombre}</h3>
            <img src=${producto.imagen} width="100" >
            <a href="/html/detalle.html?id=${id}">Mas Informacion</a>
            `
        cajaCategoria.appendChild(productoIndividual);

    }
}



agregarCajasCategorias()
listarProductos()
// listarProductos()