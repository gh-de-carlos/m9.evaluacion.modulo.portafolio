const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { upload, handleMulterError } = require('../middlewares/uploadMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.put('/profile', upload.single('avatar'), handleMulterError, userController.updateProfile);
router.put('/change-password', userController.changePassword);

module.exports = router;
