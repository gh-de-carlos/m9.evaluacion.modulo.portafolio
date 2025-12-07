# Guía Rápida de Inicio

## Acceso a la Aplicación

**URL del servidor:** http://localhost:3000

## Credenciales de Acceso

El sistema crea un usuario inicial basado en las variables de entorno del archivo `.env`:

- **FIRST_USER_EMAIL:** Email del primer usuario
- **FIRST_USER_PASSWORD:** Contraseña del primer usuario

**Importante:** Configura estas variables en tu archivo `.env` antes de ejecutar las migraciones.

## Próximos Pasos

### 1. Abre tu Navegador

Ve a: **http://localhost:3000**

### 2. Explora la Aplicación

- **Página de inicio:** Conoce las características del sistema
- **Registro:** Crea nuevos usuarios
- **Login:** Inicia sesión con las credenciales proporcionadas
- **Dashboard:** Gestiona tus tareas
- **Perfil:** Actualiza tu información y avatar

### 3. Prueba las Funcionalidades

#### Crear una Tarea
1. Haz clic en "Nueva Tarea" en el dashboard
2. Completa el formulario:
   - Título (obligatorio)
   - Descripción
   - Estado (Pendiente, En Progreso, Completada)
   - Prioridad (Alta, Media, Baja)
   - Fecha de vencimiento
3. Adjunta archivos si lo deseas (máx. 5 archivos de 5MB c/u)
4. Guarda la tarea

#### Gestionar Tareas
- **Ver detalles:** Haz clic en cualquier tarjeta de tarea
- **Editar:** En el modal de detalle, clic en "Editar"
- **Eliminar:** En el modal de detalle, clic en "Eliminar"
- **Filtrar:** Usa los filtros por estado, prioridad o búsqueda

#### Actualizar Perfil
1. Ve a "Perfil" en el menú
2. Cambia tu nombre o email
3. Sube un avatar (imagen)
4. Cambia tu contraseña si lo deseas

## Comandos Útiles

### Detener el Servidor
Presiona `Ctrl + C` en la terminal

### Reiniciar el Servidor
```bash
npm run dev
```

### Ver Logs de la Base de Datos
```bash
sudo -u postgres psql -d m9_evaluacion
```

### Limpiar y Reinstalar
```bash
rm -rf node_modules package-lock.json
npm install
```

## Archivos Importantes

- **`.env`** - Variables de entorno y credenciales
- **`src/server.js`** - Punto de entrada del servidor
- **`README.md`** - Documentación completa del proyecto
- **`package.json`** - Dependencias y scripts

## Modificar Configuración

### Cambiar el Puerto

Edita `.env`:
```env
PORT=3001
```

### Cambiar Credenciales de BD

Edita `.env` y ejecuta:
```bash
npm run migrate
```

## Estructura de URLs

| URL                | Descripción          |
|--------------------|----------------------|
| `/`                | Página de inicio     |
| `/login`           | Iniciar sesión       |
| `/register`        | Registro             |
| `/dashboard`       | Dashboard de tareas  |
| `/profile`         | Perfil de usuario    |

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/check` - Verificar autenticación

### Tareas
- `GET /api/tasks` - Listar tareas
- `GET /api/tasks/:id` - Ver tarea
- `POST /api/tasks` - Crear tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea
- `GET /api/tasks/stats` - Estadísticas

### Usuario
- `GET /api/users/profile` - Ver perfil
- `PUT /api/users/profile` - Actualizar perfil
- `PUT /api/users/change-password` - Cambiar contraseña

## 💡 Tips para Desarrollo

### Recarga Automática
El servidor usa `nodemon` para recargar automáticamente cuando cambias archivos.

### Debugging
Revisa los logs en la terminal donde ejecutaste `npm run dev`

### Base de Datos
Todos los cambios se guardan automáticamente en PostgreSQL

### LocalStorage
El token JWT se guarda en LocalStorage del navegador

## Personalización

### Cambiar Colores
Edita: `src/public/css/styles.css`

### Modificar Vistas
Edita: `src/views/*.handlebars`

### Cambiar Lógica
Edita: `src/controllers/*.js`

## Solución de Problemas

### El servidor no inicia
```bash
# Verifica que el puerto no esté en uso
lsof -ti:3000 | xargs kill -9

# Reinicia
npm run dev
```

### Error de base de datos
```bash
# Verifica que PostgreSQL esté corriendo
sudo systemctl status postgresql

# Ejecuta la migración
npm run migrate
```

### No puedo subir archivos
```bash
# Verifica permisos
chmod 755 uploads/
```

## 📖 Más Información

Consulta el **README.md** para documentación completa con:
- Arquitectura detallada
- Modelo de base de datos
- Conceptos de aprendizaje
- Recursos adicionales

## ¡Listo para Empezar!

El sistema está **100% funcional**. Explora, experimenta y aprende.

**¡Que disfrutes desarrollando!**

---

**Nota:** Si necesitas ayuda adicional, consulta la documentación completa en README.md o revisa los comentarios en el código fuente.
