// tasks.js - Manejo de tareas en el dashboard

let currentTasks = [];
let currentTaskId = null;
let taskModal;
let taskDetailModal;

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar modales de Bootstrap después de que el DOM esté listo
  taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
  taskDetailModal = new bootstrap.Modal(document.getElementById('taskDetailModal'));
  loadTasks();
  loadStats();
  setupEventListeners();
});

/**
 * Configurar event listeners
 */
function setupEventListeners() {
  // Formulario de tarea
  document.getElementById('taskForm').addEventListener('submit', handleTaskSubmit);

  // Filtros
  document.getElementById('searchInput').addEventListener('input', applyFilters);
  document.getElementById('filterEstado').addEventListener('change', applyFilters);
  document.getElementById('filterPrioridad').addEventListener('change', applyFilters);
  document.getElementById('clearFilters').addEventListener('click', clearFilters);

  // Modal de nueva tarea
  document.getElementById('taskModal').addEventListener('show.bs.modal', () => {
    if (!currentTaskId) {
      resetTaskForm();
    }
  });

  // Botones del modal de detalle
  document.getElementById('editTaskBtn').addEventListener('click', handleEditTask);
  document.getElementById('deleteTaskBtn').addEventListener('click', handleDeleteTask);
}

/**
 * Cargar todas las tareas
 */
async function loadTasks(filters = {}) {
  showLoader('tasksContainer');

  try {
    const queryParams = new URLSearchParams(filters).toString();
    const url = `/api/tasks${queryParams ? '?' + queryParams : ''}`;
    console.log('Cargando tareas desde:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Importante para enviar cookies
    });

    console.log('Respuesta recibida:', response.status, response.statusText);

    // Si no está autenticado, redirigir al login
    if (response.status === 401) {
      console.error('No autorizado - redirigiendo al login');
      window.location.href = '/login';
      return;
    }

    const data = await response.json();
    console.log('Datos recibidos:', data);

    if (response.ok && data.success) {
      currentTasks = data.data.tasks || [];
      console.log('Tareas cargadas:', currentTasks.length);
      renderTasks(currentTasks);
    } else {
      console.error('Error en respuesta:', data.message || 'Error desconocido');
      showEmptyMessage('tasksContainer', data.message || 'Error al cargar las tareas', 'fa-exclamation-triangle');
    }
  } catch (error) {
    console.error('Error al cargar tareas:', error);
    showEmptyMessage('tasksContainer', 'Error de conexión. Por favor recarga la página.', 'fa-exclamation-triangle');
  }
}

/**
 * Función para escapar HTML y prevenir XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Renderizar tareas en el DOM
 */
function renderTasks(tasks) {
  const container = document.getElementById('tasksContainer');

  if (!container) {
    console.error('Container tasksContainer no encontrado');
    return;
  }

  if (tasks.length === 0) {
    showEmptyMessage('tasksContainer', 'No hay tareas para mostrar', 'fa-clipboard-list');
    return;
  }

  container.innerHTML = tasks.map(task => {
    const titulo = escapeHtml(task.titulo || '');
    const descripcion = escapeHtml(task.descripcion || 'Sin descripción');
    const prioridad = task.prioridad || 'media';
    const estado = task.estado || 'pendiente';
    const fechaVenc = task.fechaVencimiento ? `<i class="fas fa-calendar"></i> ${formatDate(task.fechaVencimiento)}` : '';
    const attachmentCount = task.attachments && task.attachments.length > 0
      ? `<div class="mt-2"><small class="text-light"><i class="fas fa-paperclip"></i> ${task.attachments.length} archivo(s)</small></div>`
      : '';    return `
      <div class="col-md-6 col-lg-4">
        <div class="card task-card priority-${prioridad}" onclick="showTaskDetail(${task.id})">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title mb-0">${titulo}</h5>
              <span class="badge bg-${getPriorityClass(prioridad)}">${prioridad}</span>
            </div>
            <p class="card-text text-light text-truncate-2">${descripcion}</p>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="badge bg-${getStatusClass(estado)}">${estado}</span>
              <small class="text-light">${fechaVenc}</small>
            </div>
            ${attachmentCount}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Mostrar detalle de una tarea
 */
function showTaskDetail(taskId) {
  const task = currentTasks.find(t => t.id === taskId);
  if (!task) {
    console.error('Tarea no encontrada:', taskId);
    return;
  }

  currentTaskId = taskId;

  const titulo = escapeHtml(task.titulo || '');
  const descripcion = escapeHtml(task.descripcion || 'Sin descripción');
  const estado = task.estado || 'pendiente';
  const prioridad = task.prioridad || 'media';

  document.getElementById('taskDetailTitle').textContent = titulo;

  const attachmentsHtml = task.attachments && task.attachments.length > 0
    ? `<div class="mt-3">
        <strong>Archivos adjuntos:</strong>
        <div class="mt-2">
          ${task.attachments.map(att => {
            const nombreArchivo = escapeHtml(att.nombreOriginal || '');
            const rutaArchivo = escapeHtml(att.ruta || '');
            const tamanoKB = (att.tamano / 1024).toFixed(2);
            return `
              <div class="attachment-item">
                <a href="${rutaArchivo}" target="_blank" class="text-decoration-none">
                  <i class="fas fa-file"></i> ${nombreArchivo}
                  <small class="text-light">(${tamanoKB} KB)</small>
                </a>
              </div>
            `;
          }).join('')}
        </div>
      </div>`
    : '';

  document.getElementById('taskDetailBody').innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <p><strong>Estado:</strong> <span class="badge bg-${getStatusClass(estado)}">${estado}</span></p>
        <p><strong>Prioridad:</strong> <span class="badge bg-${getPriorityClass(prioridad)}">${prioridad}</span></p>
        <p><strong>Fecha de vencimiento:</strong> ${formatDate(task.fechaVencimiento)}</p>
      </div>
      <div class="col-md-6">
        <p><strong>Creada:</strong> ${formatDate(task.createdAt)}</p>
        <p><strong>Actualizada:</strong> ${formatDate(task.updatedAt)}</p>
      </div>
    </div>
    <div class="mt-3">
      <strong>Descripción:</strong>
      <p>${descripcion}</p>
    </div>
    ${attachmentsHtml}
  `;

  taskDetailModal.show();
}

/**
 * Manejar el envío del formulario de tarea
 */
async function handleTaskSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const url = currentTaskId ? `/api/tasks/${currentTaskId}` : '/api/tasks';
  const method = currentTaskId ? 'PUT' : 'POST';

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';

  try {
    const response = await fetch(url, {
      method: method,
      body: formData
    });

    const data = await response.json();

    if (response.ok && data.success) {
      taskModal.hide();
      resetTaskForm();
      loadTasks();
      loadStats();

      // Mostrar notificación de éxito
      const toast = document.createElement('div');
      toast.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-3';
      toast.style.zIndex = '9999';
      toast.innerHTML = `
        ${data.message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } else {
      alert(data.message || 'Error al guardar la tarea');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

/**
 * Manejar la edición de una tarea
 */
async function handleEditTask() {
  const task = currentTasks.find(t => t.id === currentTaskId);
  if (!task) return;

  // Rellenar el formulario
  document.getElementById('taskId').value = task.id;
  document.getElementById('titulo').value = task.titulo;
  document.getElementById('descripcion').value = task.descripcion || '';
  document.getElementById('estado').value = task.estado;
  document.getElementById('prioridad').value = task.prioridad;

  if (task.fechaVencimiento) {
    const date = new Date(task.fechaVencimiento);
    document.getElementById('fechaVencimiento').value = date.toISOString().split('T')[0];
  }

  // Mostrar archivos actuales
  if (task.attachments && task.attachments.length > 0) {
    document.getElementById('currentAttachments').innerHTML = `
      <div class="alert alert-info">
        <strong>Archivos actuales:</strong>
        ${task.attachments.map(att => `<div>${att.nombreOriginal}</div>`).join('')}
      </div>
    `;
  }

  document.getElementById('taskModalLabel').textContent = 'Editar Tarea';
  taskDetailModal.hide();
  taskModal.show();
}

/**
 * Manejar la eliminación de una tarea
 */
async function handleDeleteTask() {
  if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
    return;
  }

  try {
    const response = await fetch(`/api/tasks/${currentTaskId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (response.ok && data.success) {
      taskDetailModal.hide();
      currentTaskId = null;
      loadTasks();
      loadStats();

      const toast = document.createElement('div');
      toast.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-3';
      toast.style.zIndex = '9999';
      toast.innerHTML = `
        Tarea eliminada exitosamente
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } else {
      alert(data.message || 'Error al eliminar la tarea');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión');
  }
}

/**
 * Cargar estadísticas
 */
async function loadStats() {
  try {
    const response = await fetch('/api/tasks/stats', {
      method: 'GET',
      credentials: 'include'
    });

    if (response.status === 401) {
      console.error('No autorizado al cargar estadísticas');
      return;
    }

    const data = await response.json();

    if (response.ok && data.success) {
      document.getElementById('totalTasks').textContent = data.data.total || 0;
      document.getElementById('pendingTasks').textContent = data.data.porEstado.pendientes || 0;
      document.getElementById('inProgressTasks').textContent = data.data.porEstado.enProgreso || 0;
      document.getElementById('completedTasks').textContent = data.data.porEstado.completadas || 0;
    } else {
      console.error('Error al cargar estadísticas:', data.message);
    }
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  }
}

/**
 * Aplicar filtros
 */
function applyFilters() {
  const busqueda = document.getElementById('searchInput').value;
  const estado = document.getElementById('filterEstado').value;
  const prioridad = document.getElementById('filterPrioridad').value;

  const filters = {};
  if (busqueda) filters.busqueda = busqueda;
  if (estado) filters.estado = estado;
  if (prioridad) filters.prioridad = prioridad;

  loadTasks(filters);
}

/**
 * Limpiar filtros
 */
function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('filterEstado').value = '';
  document.getElementById('filterPrioridad').value = '';
  loadTasks();
}

/**
 * Resetear el formulario de tarea
 */
function resetTaskForm() {
  document.getElementById('taskForm').reset();
  document.getElementById('taskId').value = '';
  document.getElementById('currentAttachments').innerHTML = '';
  document.getElementById('taskModalLabel').textContent = 'Nueva Tarea';
  currentTaskId = null;
}

// Hacer la función showTaskDetail global
window.showTaskDetail = showTaskDetail;
