// Referencias básicas del DOM
const gallery = document.getElementById('gallery');
const fileInput = document.getElementById('file-input');
const uploadForm = document.getElementById('upload-form');

// Función para cargar imágenes
/** 
* @description Carga las imágenes de la galería
* @returns {void}
**/
function loadImages() {
    // Limpiamos la galería antes de cargar las imágenes
    gallery.innerHTML = '';
    
    // Cargamos las imágenes del localStorage en el DOM
    const images = JSON.parse(localStorage.getItem('images')) || [];
    images.forEach(image => {
        const imageElement = document.createElement('div');
        imageElement.classList.add('image-container');
        imageElement.innerHTML = `<img src="${image}" alt="Imagen">`;
        gallery.appendChild(imageElement);
    });
}

// Función para subir imágenes
/** 
* @description Sube nuevas imágenes a la galería
* @returns {void}
**/
function uploadImage() {
    // Obtenemos el archivo 
    const file = fileInput.files[0];
    if (!file) {
        alert('No se ha seleccionado ninguna imagen');
        return;
    }

    // Creamos un objeto FileReader
    const reader = new FileReader();
    reader.onload = function(event) {
        const imageUrl = event.target.result;
        // Agregamos la imagen al localStorage
        const images = JSON.parse(localStorage.getItem('images')) || [];
        images.push(imageUrl);
        localStorage.setItem('images', JSON.stringify(images));
        
        // Agregamos solo la nueva imagen al DOM
        const imageElement = document.createElement('div');
        imageElement.classList.add('image-container');
        imageElement.innerHTML = `<img src="${imageUrl}" alt="Imagen">`;
        gallery.appendChild(imageElement);
        
        // Limpiamos el input de archivo
        fileInput.value = '';
    }
    
    // Leemos el archivo
    reader.readAsDataURL(file);
}

// Evento para subir imágenes
uploadForm.addEventListener('submit', function(event) {
    event.preventDefault();
    uploadImage();
});

// Cargamos las imágenes al cargar la página
window.addEventListener('load', loadImages);

