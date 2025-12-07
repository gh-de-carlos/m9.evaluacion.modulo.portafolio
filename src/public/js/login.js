// login.js - Manejo del formulario de inicio de sesión

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validación básica
    if (!email || !password) {
      showAlert('alertContainer', 'Por favor completa todos los campos', 'warning');
      return;
    }

    // Deshabilitar botón de envío
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Iniciando sesión...';

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Guardar token en localStorage
        saveToken(data.data.token);

        showAlert('alertContainer', 'Inicio de sesión exitoso. Redirigiendo...', 'success');

        // Redirigir al dashboard después de 1 segundo
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        showAlert('alertContainer', data.message || 'Error al iniciar sesión', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert('alertContainer', 'Error de conexión. Por favor intenta de nuevo.', 'danger');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
});
