// auth.js - Manejo de autenticación

/**
 * Función para mostrar alertas en el DOM
 */
function showAlert(containerId, message, type = 'danger') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  container.innerHTML = '';
  container.appendChild(alert);

  // Auto cerrar después de 5 segundos
  setTimeout(() => {
    alert.remove();
  }, 5000);
}

/**
 * Función para guardar el token en localStorage
 */
function saveToken(token) {
  localStorage.setItem('authToken', token);
}

/**
 * Función para obtener el token de localStorage
 */
function getToken() {
  return localStorage.getItem('authToken');
}

/**
 * Función para eliminar el token de localStorage
 */
function removeToken() {
  localStorage.removeItem('authToken');
}

/**
 * Función para verificar si el usuario está autenticado
 */
async function checkAuth() {
  try {
    const response = await fetch('/api/auth/check');
    const data = await response.json();

    if (data.authenticated) {
      return data.data.user;
    }
    return null;
  } catch (error) {
    console.error('Error al verificar autenticación:', error);
    return null;
  }
}

/**
 * Función para cerrar sesión
 */
async function logout() {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      removeToken();
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}

// Event listener para el botón de logout
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        logout();
      }
    });
  }
});
