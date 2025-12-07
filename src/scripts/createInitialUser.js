const { User } = require('../models');
require('dotenv').config();

/**
 * Script para crear el usuario inicial desde las variables de entorno
 */
async function createInitialUser() {
  try {
    const email = process.env.FIRST_USER_EMAIL;
    const password = process.env.FIRST_USER_PASSWORD;
    const nombre = email.split('@')[0]; // Usar parte del email como nombre

    if (!email || !password) {
      console.log('⚠ No se encontraron credenciales de usuario inicial en .env');
      return;
    }

    // Verificar si ya existe
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      console.log('El usuario inicial ya existe');
      return;
    }

    // Crear usuario
    await User.create({
      nombre,
      email,
      password,
      rol: 'admin'
    });

    console.log('Usuario inicial creado exitosamente');
    console.log(`  Email: ${email}`);
    console.log(`  Nombre: ${nombre}`);
  } catch (error) {
    console.error('Error al crear usuario inicial:', error.message);
  }
}

module.exports = { createInitialUser };
