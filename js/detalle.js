import * as firebaseService from './services/firebaseService.js';

document.addEventListener('DOMContentLoaded', async () => {
    const contenedorProducto = document.getElementById('detalleProducto');

    // Leer el id del producto desde la URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const idProducto = urlParams.get('id');

    const res = await firebaseService.databaseService.getProduct(idProducto);

    if (res.success) {
        const producto = res.data;

        // Tomar las imágenes que existan
        const imagenes = [producto.imagen, producto.imagen2, producto.imagen3].filter(Boolean);

        // Crear el HTML del carrusel dinámicamente
        const carouselHTML = `
            <div class="carousel">
                ${imagenes.map((src, i) => `<img src="${src}" class="${i === 0 ? 'active' : ''}" alt="Imagen ${i + 1}">`).join('')}
                ${imagenes.length > 1 ? `
                    <button class="prev">&#10094;</button>
                    <button class="next">&#10095;</button>
                ` : ''}
            </div>
        `;

        // Insertar el contenido completo
        contenedorProducto.innerHTML = `
            <h2>${producto.nombre}</h2>
            ${carouselHTML}
            <p><b>${producto.descripcion}</b</p>
            <p><strong>Precio:</strong> $${producto.precio}</p>
        `;

        // Si hay más de una imagen, activar la lógica del carrusel
        if (imagenes.length > 1) {
            const imgs = document.querySelectorAll(".carousel img");
            const prevBtn = document.querySelector(".prev");
            const nextBtn = document.querySelector(".next");
            let currentIndex = 0;

            function showImage(index) {
                imgs.forEach(img => img.classList.remove("active"));
                imgs[index].classList.add("active");
            }

            prevBtn.addEventListener("click", () => {
                currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
                showImage(currentIndex);
            });

            nextBtn.addEventListener("click", () => {
                currentIndex = (currentIndex + 1) % imgs.length;
                showImage(currentIndex);
            });
        }

    } else {
        contenedorProducto.innerHTML = '<h2>No se encontró el producto</h2>';
    }
});
