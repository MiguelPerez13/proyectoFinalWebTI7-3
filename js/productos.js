import * as firebaseService from './services/firebaseService.js';
import { Categorias } from './categorias.js';




function mostrarProductos(){
    agregarCajasCategorias()
    listarProductos()
}

function agregarCategorias(){
    const selectorCattegorias = document.getElementById('categoria');
    for(let i = 0 ; i < Categorias.length ; i++){
        console.log(Categorias[i])
        const textoOpcion = (Categorias[i].split("-"))[1];

        const nuevaOpcion = document.createElement("option");
        nuevaOpcion.innerText = textoOpcion;
        nuevaOpcion.value = Categorias[i];
        selectorCattegorias.appendChild(nuevaOpcion);

    } 
}

function agregarCajasCategorias(){
    const contenedorProductos = document.getElementById('productos');
    const selectorCattegorias = document.getElementById('categoria');
    contenedorProductos.innerHTML = ""
    for(let i = 0 ; i < Categorias.length ; i++){
        const textoOpcion = (Categorias[i].split("-"))[1];
        
        const cajaPrincipalCategoria = document.createElement("div");
        cajaPrincipalCategoria.className = "cajaCategoria";
        cajaPrincipalCategoria.id = "main-"+Categorias[i];
        const tituloCategoria = document.createElement("h2");
        tituloCategoria.innerText = textoOpcion;
        cajaPrincipalCategoria.appendChild(tituloCategoria);
        const cajaProductosCategoria = document.createElement("div");
        cajaProductosCategoria.className = "CajaProductos"
        cajaProductosCategoria.id = Categorias[i];
        cajaPrincipalCategoria.appendChild(cajaProductosCategoria);
        
        
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
    const valorAFiltrar = document.getElementById("categoria").value;
    let productosTotal = 0;
    for (const id in allProducts) {
        const producto = allProducts[id];
        if(valorAFiltrar != "todas" && valorAFiltrar != producto.categoria){
            continue;
        }
        const cajaCategoria = document.getElementById(producto.categoria)

        document.getElementById("main-"+producto.categoria).style.display = "flex";

        const productoIndividual=document.createElement('div');
        productoIndividual.classList.add('producto');
        productoIndividual.innerHTML=`
            <h3>${producto.nombre}</h3>
            <img src=${producto.imagen} width="100" >
            <a href="./detalle.html?id=${id}">Mas Informacion</a>
            `
        cajaCategoria.appendChild(productoIndividual);
        productosTotal+=1;
    }
    if(productosTotal <= 0){
        const noProductos = document.createElement("h2");
        noProductos.id = "error";
        if(valorAFiltrar != "todas"){
            noProductos.innerText = "No hay productos en esta Categoria";
        }
        else{
            noProductos.innerText = "No hay ningun Producto";
        }
        
        document.getElementById('productos').appendChild(noProductos)
    }
}

agregarCategorias()
mostrarProductos()

document.getElementById("filtrar").addEventListener("click" , mostrarProductos)

// listarProductos()