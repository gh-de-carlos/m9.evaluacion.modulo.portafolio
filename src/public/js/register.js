// register.js - Manejo del formulario de registro

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validaciones
    if (!nombre || !email || !password || !confirmPassword) {
      showAlert('alertContainer', 'Por favor completa todos los campos', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('alertContainer', 'Las contraseñas no coinciden', 'danger');
      return;
    }

    if (password.length < 6) {
      showAlert('alertContainer', 'La contraseña debe tener al menos 6 caracteres', 'danger');
      return;
    }

    // Deshabilitar botón de envío
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Registrando...';

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Guardar token en localStorage
        saveToken(data.data.token);

        showAlert('alertContainer', 'Registro exitoso. Redirigiendo...', 'success');

        // Redirigir al dashboard después de 1 segundo
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        showAlert('alertContainer', data.message || 'Error al registrarse', 'danger');
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
