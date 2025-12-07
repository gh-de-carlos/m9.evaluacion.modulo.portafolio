# Configuración Inicial

## Antes de Empezar

Este proyecto requiere que configures tus propias credenciales para el usuario inicial.

---

## Paso a Paso

### 1. Edita el archivo `.env`

Abre el archivo `.env` ubicado en la raíz del proyecto:

```bash
nano .env
# o usa tu editor favorito: code .env, vim .env, etc.
```

### 2. Configura tus credenciales

Localiza estas dos líneas en el archivo `.env`:

```env
FIRST_USER_EMAIL=tu-email@ejemplo.com
FIRST_USER_PASSWORD=TuContraseñaSegura123!
```

### 3. Reemplaza con tus datos

**Cambia los valores de ejemplo por tus propias credenciales:**

```env
# Ejemplo personalizado
FIRST_USER_EMAIL=maria.garcia@email.com
FIRST_USER_PASSWORD=MiPassword2024!
```

**Requisitos de la contraseña:**
- Mínimo 6 caracteres
- Se recomienda incluir mayúsculas, minúsculas, números y símbolos

### 4. Guarda el archivo

Guarda los cambios en el archivo `.env`.

### 5. Ejecuta las migraciones

Una vez configuradas tus credenciales, ejecuta:

```bash
npm run migrate
```

Este comando:
- Conecta con la base de datos
- Sincroniza los modelos (crea las tablas)
- Crea tu usuario inicial con las credenciales que configuraste

### 6. Inicia el servidor

```bash
npm run dev
```

### 7. Accede a la aplicación

Abre tu navegador en: **http://localhost:3000**

Inicia sesión con:
- **Email:** El que configuraste en `FIRST_USER_EMAIL`
- **Contraseña:** La que configuraste en `FIRST_USER_PASSWORD`

---

## Seguridad

- La contraseña se almacena encriptada con bcrypt
- Nunca compartas tu archivo `.env`
- El archivo `.env` está en `.gitignore` por seguridad
- Usa un archivo `.env.example` como referencia (sin credenciales reales)

---

## Preguntas Frecuentes

### ¿Puedo cambiar mis credenciales después?

Sí, tienes dos opciones:

**Opción 1:** Cambiar contraseña desde la aplicación
- Inicia sesión
- Ve a "Perfil"
- Usa la opción "Cambiar Contraseña"

**Opción 2:** Recrear el usuario
1. Edita `.env` con nuevas credenciales
2. Elimina el usuario existente desde la base de datos:
   ```bash
   sudo -u postgres psql -d m9_evaluacion -c "DELETE FROM usuarios WHERE email='tu-email-anterior@ejemplo.com';"
   ```
3. Ejecuta nuevamente: `npm run migrate`

### ¿Qué pasa si no cambio las credenciales?

El sistema usará las credenciales de ejemplo que están en el `.env`. Por seguridad, **siempre debes cambiarlas** antes de ejecutar las migraciones.

### ¿Puedo crear más usuarios?

Sí, puedes:
- Usar el formulario de registro en la aplicación web
- El primer usuario creado con `.env` es administrador
- Los demás usuarios creados vía registro son usuarios normales

---

## Siguiente Paso

Una vez completada la configuración, consulta:
- **START_HERE.md** - Para comenzar a usar la aplicación
- **QUICK_START.md** - Guía rápida de comandos
- **README.md** - Documentación completa

---

**¡Listo! Ya puedes empezar a usar el sistema.**
