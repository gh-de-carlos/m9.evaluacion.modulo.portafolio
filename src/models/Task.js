const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El título es obligatorio'
        },
        len: {
          args: [3, 200],
          msg: 'El título debe tener entre 3 y 200 caracteres'
        }
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'en-progreso', 'completada'),
      defaultValue: 'pendiente',
      allowNull: false
    },
    prioridad: {
      type: DataTypes.ENUM('baja', 'media', 'alta'),
      defaultValue: 'media',
      allowNull: false
    },
    fechaVencimiento: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'Debe ser una fecha válida'
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    }
  }, {
    tableName: 'tareas',
    timestamps: true
  });

  return Task;
};
