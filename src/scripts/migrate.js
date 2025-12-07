const { sequelize } = require('../models');
const { createInitialUser } = require('./createInitialUser');
require('dotenv').config();

/**
 * Script para ejecutar migraciones y crear datos iniciales
 */
async function migrate() {
  try {
    console.log('Iniciando proceso de migración...\n');

    // Verificar conexión
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida\n');

    // Sincronizar modelos (crear/actualizar tablas)
    console.log('Sincronizando modelos con la base de datos...');
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados correctamente\n');

    // Crear usuario inicial
    console.log('Creando usuario inicial...');
    await createInitialUser();
    console.log();

    console.log('Migración completada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('Error en el proceso de migración:', error);
    process.exit(1);
  }
}

// Ejecutar migración
migrate();
