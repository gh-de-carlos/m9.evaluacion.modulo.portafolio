// main.js - Funciones generales

/**
 * Función para formatear fechas
 */
function formatDate(dateString) {
  if (!dateString) return 'Sin fecha';

  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
}

/**
 * Función para obtener la clase de color según el estado
 */
function getStatusClass(status) {
  const classes = {
    'pendiente': 'warning',
    'en-progreso': 'info',
    'completada': 'success'
  };
  return classes[status] || 'secondary';
}

/**
 * Función para obtener la clase de color según la prioridad
 */
function getPriorityClass(priority) {
  const classes = {
    'alta': 'danger',
    'media': 'warning',
    'baja': 'success'
  };
  return classes[priority] || 'secondary';
}

/**
 * Función para validar archivos antes de subirlos
 */
function validateFiles(files) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const maxFiles = 5;

  if (files.length > maxFiles) {
    return { valid: false, message: `Máximo ${maxFiles} archivos permitidos` };
  }

  for (let file of files) {
    if (file.size > maxSize) {
      return { valid: false, message: `El archivo ${file.name} excede el tamaño máximo de 5MB` };
    }
  }

  return { valid: true };
}

/**
 * Función para mostrar un loader
 */
function showLoader(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
  `;
}

/**
 * Función para ocultar un loader y mostrar un mensaje
 */
function showEmptyMessage(containerId, message, icon = 'fa-info-circle') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="col-12 text-center py-5">
      <i class="fas ${icon} fa-3x text-light mb-3"></i>
      <p class="text-light">${message}</p>
    </div>
  `;
}

/**
 * Función para hacer scroll suave al inicio de la página
 */
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Inicializar tooltips de Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});
