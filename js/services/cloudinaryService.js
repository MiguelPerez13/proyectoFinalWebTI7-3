import { cloudinaryConfig } from "../config/cloudinaryConfig.js";

export const cloudinaryService = {
    // Inicializar el widget de carga de Cloudinary
    initUploadWidget(callback) {
        return cloudinary.createUploadWidget(cloudinaryConfig, (error, result) => {
            if (!error && result && result.event === "success") {
                callback({ 
                    success: true, 
                    url: result.info.secure_url,
                    message: 'Imagen subida correctamente'
                });
            } else if (error) {
                console.error('Error al subir la imagen:', error);
                callback({ 
                    success: false, 
                    message: 'Error al subir la imagen' 
                });
            }
        });
    },

    // Subir imagen directamente (alternativa al widget)
    async uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', cloudinaryConfig.uploadPreset);
        
        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
                { method: 'POST', body: formData }
            );
            const data = await response.json();
            return { 
                success: true, 
                url: data.secure_url,
                message: 'Imagen subida correctamente'
            };
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            return { 
                success: false, 
                message: 'Error al subir la imagen' 
            };
        }
    }
};

/*
// Inicialización del widget de Cloudinary
const initCloudinaryWidget = (imageInput, uploadButton) => {
    const widget = storageService.initUploadWidget((result) => {
        if (result.success) {
            txtUrl.value = result.url;
            showMessage('mensaje', result.message);
        } else {
            showMessage('mensaje', result.message, true);
        }
    });

    uploadButton.addEventListener('click', () => widget.open());

    // Manejo alternativo para el input de tipo file
    imageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        console.log(file)
        if (file) {
            const result = await storageService.uploadImage(file);
            if (result.success) {
                txtUrl.value = result.url;
                showMessage('mensaje', result.message);
            } else {
                showMessage('mensaje', result.message, true);
            }
        }
    });
};

*/