const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { upload, handleMulterError } = require('../middlewares/uploadMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de tareas
router.get('/', taskController.getAllTasks);
router.get('/stats', taskController.getTaskStats);
router.get('/:id', taskController.getTaskById);
router.post('/', upload.array('attachments', 5), handleMulterError, taskController.createTask);
router.put('/:id', upload.array('attachments', 5), handleMulterError, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
