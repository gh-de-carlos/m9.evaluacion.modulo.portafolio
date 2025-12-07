const { Task, Attachment, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Obtener todas las tareas del usuario autenticado
 */
exports.getAllTasks = async (req, res) => {
  try {
    const { estado, prioridad, busqueda } = req.query;
    const userId = req.user.id;

    // Construir filtros
    const where = { userId };

    if (estado) {
      where.estado = estado;
    }

    if (prioridad) {
      where.prioridad = prioridad;
    }

    if (busqueda) {
      where[Op.or] = [
        { titulo: { [Op.iLike]: `%${busqueda}%` } },
        { descripcion: { [Op.iLike]: `%${busqueda}%` } }
      ];
    }

    const tasks = await Task.findAll({
      where,
      include: [
        {
          model: Attachment,
          as: 'attachments'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { tasks }
    });
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tareas',
      error: error.message
    });
  }
};

/**
 * Obtener una tarea específica por ID
 */
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findOne({
      where: { id, userId },
      include: [
        {
          model: Attachment,
          as: 'attachments'
        }
      ]
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.json({
      success: true,
      data: { task }
    });
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tarea',
      error: error.message
    });
  }
};

/**
 * Crear una nueva tarea
 */
exports.createTask = async (req, res) => {
  try {
    const { titulo, descripcion, estado, prioridad, fechaVencimiento } = req.body;
    const userId = req.user.id;

    // Validar campos obligatorios
    if (!titulo) {
      return res.status(400).json({
        success: false,
        message: 'El título es obligatorio'
      });
    }

    // Crear tarea
    const task = await Task.create({
      titulo,
      descripcion,
      estado: estado || 'pendiente',
      prioridad: prioridad || 'media',
      fechaVencimiento: fechaVencimiento || null,
      userId
    });

    // Si hay archivos adjuntos
    if (req.files && req.files.length > 0) {
      const attachments = req.files.map(file => ({
        nombreOriginal: file.originalname,
        nombreArchivo: file.filename,
        mimeType: file.mimetype,
        tamano: file.size,
        ruta: `/uploads/${file.filename}`,
        taskId: task.id
      }));

      await Attachment.bulkCreate(attachments);
    }

    // Obtener tarea completa con adjuntos
    const taskComplete = await Task.findByPk(task.id, {
      include: [{ model: Attachment, as: 'attachments' }]
    });

    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      data: { task: taskComplete }
    });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear tarea',
      error: error.message
    });
  }
};

/**
 * Actualizar una tarea existente
 */
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, estado, prioridad, fechaVencimiento } = req.body;
    const userId = req.user.id;

    // Buscar tarea
    const task = await Task.findOne({ where: { id, userId } });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    // Actualizar campos
    if (titulo !== undefined) task.titulo = titulo;
    if (descripcion !== undefined) task.descripcion = descripcion;
    if (estado !== undefined) task.estado = estado;
    if (prioridad !== undefined) task.prioridad = prioridad;
    if (fechaVencimiento !== undefined) task.fechaVencimiento = fechaVencimiento;

    await task.save();

    // Si hay nuevos archivos adjuntos
    if (req.files && req.files.length > 0) {
      const attachments = req.files.map(file => ({
        nombreOriginal: file.originalname,
        nombreArchivo: file.filename,
        mimeType: file.mimetype,
        tamano: file.size,
        ruta: `/uploads/${file.filename}`,
        taskId: task.id
      }));

      await Attachment.bulkCreate(attachments);
    }

    // Obtener tarea actualizada con adjuntos
    const taskUpdated = await Task.findByPk(task.id, {
      include: [{ model: Attachment, as: 'attachments' }]
    });

    res.json({
      success: true,
      message: 'Tarea actualizada exitosamente',
      data: { task: taskUpdated }
    });
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar tarea',
      error: error.message
    });
  }
};

/**
 * Eliminar una tarea
 */
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findOne({ where: { id, userId } });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    await task.destroy();

    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar tarea',
      error: error.message
    });
  }
};

/**
 * Obtener estadísticas de tareas del usuario
 */
exports.getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const total = await Task.count({ where: { userId } });
    const pendientes = await Task.count({ where: { userId, estado: 'pendiente' } });
    const enProgreso = await Task.count({ where: { userId, estado: 'en-progreso' } });
    const completadas = await Task.count({ where: { userId, estado: 'completada' } });

    const prioridadAlta = await Task.count({ where: { userId, prioridad: 'alta' } });
    const prioridadMedia = await Task.count({ where: { userId, prioridad: 'media' } });
    const prioridadBaja = await Task.count({ where: { userId, prioridad: 'baja' } });

    res.json({
      success: true,
      data: {
        total,
        porEstado: {
          pendientes,
          enProgreso,
          completadas
        },
        porPrioridad: {
          alta: prioridadAlta,
          media: prioridadMedia,
          baja: prioridadBaja
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};
