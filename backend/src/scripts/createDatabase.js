/**
 * Script para crear la base de datos y datos iniciales
 * Ejecutar con: npm run db:create
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });

  try {
    // Crear base de datos si no existe
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'gestion_incidencias'} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log('✓ Base de datos creada/verificada');

    // Seleccionar la base de datos
    await connection.query(`USE ${process.env.DB_NAME || 'gestion_incidencias'}`);

    // Ejecutar migraciones SQL versionadas
    const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');
    const seedersDir = path.join(__dirname, '..', 'database', 'seeders');
    const scripts = [];

    if (fs.existsSync(migrationsDir)) {
      const migrationFiles = fs.readdirSync(migrationsDir).sort();
      migrationFiles.forEach((file) => scripts.push(path.join(migrationsDir, file)));
    }
    if (fs.existsSync(seedersDir)) {
      const seedFiles = fs.readdirSync(seedersDir).sort();
      seedFiles.forEach((file) => scripts.push(path.join(seedersDir, file)));
    }

    for (const scriptPath of scripts) {
      const sqlContent = fs.readFileSync(scriptPath, 'utf8');
      const statements = sqlContent
        .split(';')
        .map((statement) => statement.trim())
        .filter((statement) => statement.length > 0 && !statement.startsWith('--'));

      for (const statement of statements) {
        await connection.query(statement);
      }
      console.log(`✓ Ejecutado: ${path.basename(scriptPath)}`);
    }

    console.log('✓ Esquema y catálogos inicializados');

    // Crear usuario administrador con contraseña hasheada
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Verificar si ya existe el admin
    const [adminExists] = await connection.query(
      'SELECT id FROM usuarios WHERE email = ?',
      ['admin@conalep.edu.mx']
    );

    if (adminExists.length === 0) {
      await connection.query(
        `INSERT INTO usuarios (nombre, email, password, rol_id, activo)
         VALUES (?, ?, ?, ?, ?)`,
        ['Administrador', 'admin@conalep.edu.mx', hashedPassword, 3, true]
      );
      console.log('✓ Usuario administrador creado');
      console.log('  Email: admin@conalep.edu.mx');
      console.log('  Password: admin123');
    } else {
      console.log('✓ Usuario administrador ya existe');
    }

    console.log('\n✓ Base de datos inicializada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

createDatabase();