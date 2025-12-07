// profile.js - Manejo del perfil de usuario

document.addEventListener('DOMContentLoaded', () => {
  setupProfileForm();
  setupPasswordForm();
  setupAvatarPreview();
});

/**
 * Configurar formulario de perfil
 */
function setupProfileForm() {
  const profileForm = document.getElementById('profileForm');

  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(profileForm);

    const submitBtn = profileForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showAlert('profileAlertContainer', 'Perfil actualizado exitosamente', 'success');

        // Actualizar imagen de avatar si se cambió
        if (data.data.user.avatar) {
          document.getElementById('avatarPreview').src = data.data.user.avatar;
        }

        // Recargar página después de 2 segundos
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        showAlert('profileAlertContainer', data.message || 'Error al actualizar perfil', 'danger');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert('profileAlertContainer', 'Error de conexión', 'danger');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

/**
 * Configurar formulario de cambio de contraseña
 */
function setupPasswordForm() {
  const passwordForm = document.getElementById('passwordForm');

  passwordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    // Validaciones
    if (newPassword !== confirmNewPassword) {
      showAlert('passwordAlertContainer', 'Las contraseñas no coinciden', 'danger');
      return;
    }

    if (newPassword.length < 6) {
      showAlert('passwordAlertContainer', 'La nueva contraseña debe tener al menos 6 caracteres', 'danger');
      return;
    }

    const submitBtn = passwordForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Cambiando...';

    try {
      const response = await fetch('/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showAlert('passwordAlertContainer', 'Contraseña actualizada exitosamente', 'success');
        passwordForm.reset();
      } else {
        showAlert('passwordAlertContainer', data.message || 'Error al cambiar contraseña', 'danger');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert('passwordAlertContainer', 'Error de conexión', 'danger');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

/**
 * Configurar preview del avatar
 */
function setupAvatarPreview() {
  const avatarInput = document.getElementById('avatar');
  const avatarPreview = document.getElementById('avatarPreview');

  avatarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        showAlert('profileAlertContainer', 'Por favor selecciona una imagen válida', 'danger');
        avatarInput.value = '';
        return;
      }

      // Validar tamaño (máx. 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showAlert('profileAlertContainer', 'La imagen no debe superar los 5MB', 'danger');
        avatarInput.value = '';
        return;
      }

      // Mostrar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        avatarPreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
}
