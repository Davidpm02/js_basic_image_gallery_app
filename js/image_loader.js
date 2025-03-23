// Referencias básicas del DOM
const gallery = document.getElementById('gallery');
const fileInput = document.getElementById('file-input');
const uploadForm = document.getElementById('upload-form');
const imageSlider = document.getElementById('imageSlider');
const sliderImage = document.getElementById('sliderImage');
const imageCounter = document.getElementById('imageCounter');

// Variables globales para el slider
let currentImageIndex = 0;
let images = [];

// Función para cargar imágenes
/** 
* @description Carga las imágenes de la galería
* @returns {void}
**/
function loadImages() {
    // Limpiamos la galería antes de cargar las imágenes
    gallery.innerHTML = '';
    
    // Cargamos las imágenes del localStorage en el DOM
    images = JSON.parse(localStorage.getItem('images')) || [];
    images.forEach((image, index) => {
        const imageElement = document.createElement('div');
        imageElement.classList.add('image-container');
        
        // Crear contenedor para la imagen
        const img = document.createElement('img');
        img.src = image;
        img.alt = `Imagen ${index + 1}`;
        
        // Crear botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-icon');
        deleteButton.innerHTML = '×';
        deleteButton.title = 'Eliminar imagen';
        
        // Evento para eliminar la imagen desde la galería
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que se abra el slider
            deleteImage(index);
        });
        
        // Agregamos el evento click para abrir el slider
        img.addEventListener('click', () => {
            openSlider(index);
        });
        
        imageElement.appendChild(img);
        imageElement.appendChild(deleteButton);
        gallery.appendChild(imageElement);
    });
}

// Función para eliminar una imagen
function deleteImage(index) {
    if (confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
        images.splice(index, 1);
        localStorage.setItem('images', JSON.stringify(images));
        
        if (imageSlider.style.display === 'flex') {
            if (images.length === 0) {
                closeSlider();
            } else {
                if (currentImageIndex >= images.length) {
                    currentImageIndex = images.length - 1;
                }
                sliderImage.src = images[currentImageIndex];
                updateImageCounter();
            }
        }
        
        loadImages(); // Recargar la galería
    }
}

// Función para subir imágenes
/** 
* @description Sube nuevas imágenes a la galería
* @returns {void}
**/
function uploadImage() {
    const file = fileInput.files[0];
    if (!file) {
        alert('No se ha seleccionado ninguna imagen');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const imageUrl = event.target.result;
        images = JSON.parse(localStorage.getItem('images')) || [];
        images.push(imageUrl);
        localStorage.setItem('images', JSON.stringify(images));
        
        // Agregamos solo la nueva imagen al DOM
        const imageElement = document.createElement('div');
        imageElement.classList.add('image-container');
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `Imagen ${images.length}`;
        
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-icon');
        deleteButton.innerHTML = '×';
        deleteButton.title = 'Eliminar imagen';
        
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteImage(images.length - 1);
        });
        
        // Agregamos el evento click para la nueva imagen
        img.addEventListener('click', () => {
            openSlider(images.length - 1);
        });
        
        imageElement.appendChild(img);
        imageElement.appendChild(deleteButton);
        gallery.appendChild(imageElement);
        
        // Limpiamos el input de archivo
        fileInput.value = '';
    }
    
    reader.readAsDataURL(file);
}

// Funciones del slider
function openSlider(index) {
    currentImageIndex = index;
    sliderImage.src = images[currentImageIndex];
    imageSlider.style.display = 'flex';
    updateImageCounter();
}

function closeSlider() {
    imageSlider.style.display = 'none';
}

function nextImage() {
    if (currentImageIndex < images.length - 1) {
        currentImageIndex++;
    } else {
        currentImageIndex = 0;
    }
    sliderImage.src = images[currentImageIndex];
    updateImageCounter();
}

function prevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
    } else {
        currentImageIndex = images.length - 1;
    }
    sliderImage.src = images[currentImageIndex];
    updateImageCounter();
}

function updateImageCounter() {
    imageCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
}

// Event Listeners
uploadForm.addEventListener('submit', function(event) {
    event.preventDefault();
    uploadImage();
});

document.getElementById('closeSlider').addEventListener('click', closeSlider);
document.getElementById('nextImage').addEventListener('click', nextImage);
document.getElementById('prevImage').addEventListener('click', prevImage);
document.getElementById('deleteImage').addEventListener('click', () => deleteImage(currentImageIndex));

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    if (imageSlider.style.display === 'flex') {
        if (e.key === 'Escape') {
            closeSlider();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'Delete') {
            deleteImage(currentImageIndex);
        }
    }
});

// Cargamos las imágenes al cargar la página
window.addEventListener('load', loadImages);

