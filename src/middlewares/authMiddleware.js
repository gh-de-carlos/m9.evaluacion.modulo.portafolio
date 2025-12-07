const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware para verificar el token JWT en las cookies
 * Protege las rutas que requieren autenticación
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Obtener token de las cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado - Token no proporcionado'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario
    const user = await User.findByPk(decoded.id);

    if (!user || !user.activo) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado - Usuario no encontrado o inactivo'
      });
    }

    // Agregar usuario al request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

/**
 * Middleware para verificar si el usuario es administrador
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado - Se requieren permisos de administrador'
    });
  }
};

/**
 * Middleware opcional de autenticación para páginas web
 * No bloquea el acceso, solo añade el usuario si está autenticado
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);

      if (user && user.activo) {
        req.user = user;
        res.locals.user = user;
      }
    }
  } catch (error) {
    // Continuar sin autenticación
  }
  next();
};

module.exports = {
  authMiddleware,
  isAdmin,
  optionalAuth
};
