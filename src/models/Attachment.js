const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Attachment = sequelize.define('Attachment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombreOriginal: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nombreArchivo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tamano: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    ruta: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tareas',
        key: 'id'
      }
    }
  }, {
    tableName: 'adjuntos',
    timestamps: true
  });

  return Attachment;
};
