const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/check', authController.checkAuth);

// Rutas protegidas
router.post('/logout', authMiddleware, authController.logout);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
