require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const pageRoutes = require('./routes/pageRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar Handlebars
app.engine('handlebars', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    eq: (a, b) => a === b,
    formatDate: (date) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    statusClass: (status) => {
      const classes = {
        'pendiente': 'warning',
        'en-progreso': 'info',
        'completada': 'success'
      };
      return classes[status] || 'secondary';
    },
    priorityClass: (priority) => {
      const classes = {
        'alta': 'danger',
        'media': 'warning',
        'baja': 'success'
      };
      return classes[priority] || 'secondary';
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rutas
app.use('/', pageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Página no encontrada',
    error: 'La página que buscas no existe',
    code: 404
  });
});

// Manejo de errores general
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Error del servidor',
    error: 'Ha ocurrido un error en el servidor',
    code: 500
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente');

    // Sincronizar modelos con la base de datos
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados con la base de datos');

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
