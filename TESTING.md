# Guía de Pruebas y Debugging

## Corrección Aplicada (Actualizada)

Se ha mejorado significativamente el manejo de errores y autenticación en el dashboard:

### Cambios Realizados (Última actualización):

1. **Mejorada la función `loadTasks()`**
   - Añadido `credentials: 'include'` para enviar cookies
   - Logging detallado en consola para debugging
   - Manejo de código 401 (no autorizado)
   - Redirección automática al login si no hay sesión
   - Mejor manejo de errores

2. **Mejorada la función `loadStats()`**
   - Añadido `credentials: 'include'`
   - Mejor manejo de errores 401
   - Valores por defecto (0) si no hay datos

3. **Añadido escape HTML para seguridad**
   - Función `escapeHtml()` implementada
   - Prevención de XSS en renderizado de tareas

---

## DEBUGGING PASO A PASO

### Paso 1: Verificar que el Servidor Esté Corriendo

```bash
# En la terminal, debes ver:
Conexión a la base de datos establecida correctamente
Modelos sincronizados con la base de datos
Servidor ejecutándose en http://localhost:3000
```

**Si ves esto, el servidor está OK**

---

### Paso 2: Abrir Consola del Navegador ANTES de Login

1. Abre el navegador en: http://localhost:3000
2. Presiona **F12** para abrir DevTools
3. Ve a la pestaña **Console**
4. **Mantén esta pestaña abierta durante todo el proceso**

---

### Paso 3: Iniciar Sesión y Observar la Consola

1. Ve a `/login` e inicia sesión
2. **Observa la consola**, debes ver mensajes como:

```
Cargando tareas desde: /api/tasks
Respuesta recibida: 200 OK
Datos recibidos: {success: true, data: {...}}
Tareas cargadas: X
```

#### Si ves esto, HAY UN PROBLEMA:

**Escenario A: Error 401 (No Autorizado)**
```
Cargando tareas desde: /api/tasks
Respuesta recibida: 401 Unauthorized
No autorizado - redirigiendo al login
```

**Causa:** La cookie de sesión no se está enviando o es inválida.

**Solución:**
1. Ve a DevTools > **Application** > **Cookies** > `http://localhost:3000`
2. Busca una cookie llamada `token`
3. **Si NO existe la cookie `token`:**
   - El login NO está guardando la cookie correctamente
   - Verifica el archivo `src/controllers/authController.js`

4. **Si existe pero dice "redirigiendo al login":**
   - La cookie puede estar corrupta o expirada
   - Borra todas las cookies: DevTools > Application > Clear storage > Clear site data
   - Intenta iniciar sesión nuevamente

---

**Escenario B: Error de Red**
```
Error al cargar tareas: TypeError: Failed to fetch
```

**Causa:** El servidor no está respondiendo.

**Solución:**
1. Verifica que el servidor esté corriendo en la terminal
2. Verifica que puedas acceder a: http://localhost:3000
3. Reinicia el servidor: `Ctrl+C` y luego `npm run dev`

---

**Escenario C: El Spinner Nunca Desaparece pero NO hay errores**

**Causa:** La función `renderTasks()` o `showEmptyMessage()` no se está ejecutando.

**Solución - Ejecuta en la consola:**

```javascript
// Verifica que las funciones existan
console.log('showLoader:', typeof showLoader);
console.log('renderTasks:', typeof renderTasks);
console.log('showEmptyMessage:', typeof showEmptyMessage);
```

Si alguna dice `"undefined"`:
- Los archivos JS no se están cargando
- Verifica en DevTools > **Network** que estos archivos se carguen:
  - `/js/main.js` (status 200)
  - `/js/tasks.js` (status 200)

---

### Paso 4: Verificar las Cookies Manualmente

1. DevTools > **Application** > **Cookies** > `http://localhost:3000`
2. Busca una cookie llamada `token`

**Debe tener:**
- Name: `token`
- Value: (un string largo tipo JWT)
- HttpOnly: (marcado)
- Path: `/`
- SameSite: Lax (o None/Strict)

---

## Verificar Estado del Servidor

### Comprobar que el servidor está corriendo:

```bash
# En la terminal donde ejecutaste npm run dev, debes ver:
Conexión a la base de datos establecida correctamente
Modelos sincronizados con la base de datos
Servidor ejecutándose en http://localhost:3000
```

### Si el servidor no está corriendo:

```bash
cd /home/carlos/coding/working/bootcamp/m9.evaluacion.modulo.portafolio
npm run dev
```

---

## Debugging Adicional

### Verificar que los archivos JS se carguen:

En la consola del navegador, escribe:
```javascript
// Verificar que las funciones existen
typeof showLoader
typeof renderTasks
typeof loadTasks
```

Todas deben retornar `"function"`, no `"undefined"`

### Verificar datos de tareas:

En la consola del navegador, después de cargar el dashboard:
```javascript
// Ver las tareas actuales
console.log(currentTasks);

// Deberías ver un array de tareas o un array vacío []
```

---

## Checklist de Verificación

Marca cada item cuando funcione correctamente:

- [ ] El dashboard carga sin loader atascado
- [ ] Puedo crear una nueva tarea
- [ ] La nueva tarea aparece inmediatamente en la lista
- [ ] Las estadísticas se actualizan correctamente
- [ ] Los filtros funcionan correctamente
- [ ] Puedo ver el detalle de una tarea
- [ ] Puedo editar una tarea
- [ ] Puedo eliminar una tarea
- [ ] No hay errores en la consola del navegador
- [ ] Las peticiones en Network tienen status 200

---

## Resultado Esperado Final

Después de estos pasos, debes poder:

1. Cargar el dashboard sin problemas
2. Ver la lista de tareas (o mensaje si no hay)
3. Crear, editar y eliminar tareas sin loaders atascados
4. Filtrar tareas sin problemas
5. Ver estadísticas actualizadas en tiempo real

---

## Si Persiste el Problema

Si después de todas estas verificaciones el problema continúa:

1. **Captura de pantalla de:**
   - La consola del navegador (errores)
   - La pestaña Network (peticiones fallidas)
   - La terminal del servidor

2. **Información adicional:**
   - ¿Qué navegador usas? (Chrome, Firefox, Safari, etc.)
   - ¿Qué acción específica causa el problema?
   - ¿Hay algún error en la terminal del servidor?

---

**Fecha de corrección:** Diciembre 7, 2025
**Archivos modificados:** `src/public/js/tasks.js`
