import bcrypt from "bcryptjs"

/**
 * Script para generar contraseñas hasheadas con bcrypt
 * Uso: node backend/scripts/generate-hashed-passwords.js
 */

const passwords = {
  admin123: "Contraseña para Administrador",
  docente123: "Contraseña para Docentes",
  prefecto123: "Contraseña para Prefecto",
}

console.log("\n🔐 GENERADOR DE CONTRASEÑAS HASHEADAS\n")
console.log("═".repeat(60))

async function generateHashes() {
  for (const [password, description] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, 10)
    console.log(`\n${description}:`)
    console.log(`  Texto plano: ${password}`)
    console.log(`  Hash bcrypt: ${hash}`)
  }

  console.log("\n" + "═".repeat(60))
  console.log("\n✅ Copia estos hashes y úsalos en tus INSERT INTO usuario")
  console.log("⚠️  IMPORTANTE: Los hashes cambian cada vez que ejecutas este script\n")
}

generateHashes()
