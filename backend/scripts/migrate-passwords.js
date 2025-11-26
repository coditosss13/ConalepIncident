import bcrypt from "bcryptjs"
import pool from "../src/config/db.js"

const SALT_ROUNDS = 10

async function migratePasswords() {
  const client = await pool.connect()

  try {
    console.log("🔄 Iniciando migración de contraseñas...")

    // Obtener todos los usuarios
    const result = await client.query("SELECT id_usuario, password FROM usuario")
    const usuarios = result.rows

    console.log(`📊 Total de usuarios encontrados: ${usuarios.length}`)

    let migrated = 0
    let skipped = 0

    for (const usuario of usuarios) {
      // Verificar si la contraseña ya está hasheada (bcrypt hashes empiezan con $2b$)
      if (usuario.password.startsWith("$2b$") || usuario.password.startsWith("$2a$")) {
        console.log(`⏭️  Usuario ${usuario.id_usuario}: Contraseña ya hasheada, omitiendo...`)
        skipped++
        continue
      }

      // Hashear la contraseña actual
      const hashedPassword = await bcrypt.hash(usuario.password, SALT_ROUNDS)

      // Actualizar en la base de datos
      await client.query("UPDATE usuario SET password = $1 WHERE id_usuario = $2", [hashedPassword, usuario.id_usuario])

      console.log(`✅ Usuario ${usuario.id_usuario}: Contraseña migrada correctamente`)
      migrated++
    }

    console.log("\n📊 Resumen de migración:")
    console.log(`✅ Contraseñas migradas: ${migrated}`)
    console.log(`⏭️  Contraseñas ya hasheadas: ${skipped}`)
    console.log("✅ Migración completada exitosamente")
  } catch (error) {
    console.error("❌ Error durante la migración:", error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

// Ejecutar migración
migratePasswords().catch((error) => {
  console.error("❌ Error fatal en migración:", error)
  process.exit(1)
})
