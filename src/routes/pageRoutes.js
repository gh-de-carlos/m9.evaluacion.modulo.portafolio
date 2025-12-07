const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middlewares/authMiddleware');

// Aplicar middleware de autenticación opcional a todas las rutas
router.use(optionalAuth);

// Página de inicio
router.get('/', (req, res) => {
  res.render('home', {
    title: 'Inicio',
    user: req.user
  });
});

// Página de login
router.get('/login', (req, res) => {
  if (req.user) {
    return res.redirect('/dashboard');
  }
  res.render('login', {
    title: 'Iniciar Sesión'
  });
});

// Página de registro
router.get('/register', (req, res) => {
  if (req.user) {
    return res.redirect('/dashboard');
  }
  res.render('register', {
    title: 'Registro'
  });
});

// Dashboard (requiere autenticación)
router.get('/dashboard', (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('dashboard', {
    title: 'Dashboard',
    user: req.user
  });
});

// Página de perfil
router.get('/profile', (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('profile', {
    title: 'Mi Perfil',
    user: req.user
  });
});

module.exports = router;
