const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const User = require('./User')(sequelize);
const Task = require('./Task')(sequelize);
const Attachment = require('./Attachment')(sequelize);

// Definir relaciones entre modelos
User.hasMany(Task, {
  foreignKey: 'userId',
  as: 'tasks',
  onDelete: 'CASCADE'
});

Task.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Task.hasMany(Attachment, {
  foreignKey: 'taskId',
  as: 'attachments',
  onDelete: 'CASCADE'
});

Attachment.belongsTo(Task, {
  foreignKey: 'taskId',
  as: 'task'
});

module.exports = {
  sequelize,
  User,
  Task,
  Attachment
};
