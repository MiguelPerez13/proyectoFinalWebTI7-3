import { ref, set, child, get, update, remove } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";
import { db } from "../config/firebaseConfig.js";


export const databaseService = {
    // Insertar un nuevo producto
    async insertProduct(product) {
        try {
            await set(ref(db, 'Productos/' + product.id), product);
            return { success: true, message: 'Producto agregado con éxito' };
        } catch (error) {
            console.error('Error al insertar producto:', error);
            return { success: false, message: 'Error al agregar el producto' };
        }
    },

    // Buscar un producto por número de serie
    async getProduct(id) {
        try {
            const snapshot = await get(child(ref(db), `Producto/${id}`));
            if (snapshot.exists()) {
                return { success: true, data: snapshot.val() };
            } else {
                return { success: false, message: 'No se encontró el producto' };
            }
        } catch (error) {
            console.error('Error al buscar producto:', error);
            return { success: false, message: 'Error al buscar el producto' };
        }
    },

    // Actualizar un producto
    async updateProduct(id, updates) {
        try {
            await update(ref(db, 'Productos/' + id), updates);
            return { success: true, message: 'Producto actualizado con éxito' };
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            return { success: false, message: 'Error al actualizar el producto' };
        }
    },

    // Eliminar un producto
    async deleteProduct(id) {
        try {
            await remove(ref(db, 'Productos/' + id));
            return { success: true, message: 'Producto eliminado con éxito' };
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            return { success: false, message: 'Error al eliminar el producto' };
        }
    },

    // Obtener todos los productos
    async getAllProducts() {
        try {
            const snapshot = await get(child(ref(db), 'Productos'));
            if (snapshot.exists()) {
                return { success: true, data: snapshot.val() };
            } else {
                return { success: true, data: {} };
            }
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return { success: false, message: 'Error al obtener los productos' };
        }
    }
};
