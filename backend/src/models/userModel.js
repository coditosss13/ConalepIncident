import pool from "../config/db.js"
import bcrypt from "bcryptjs" // Importar bcryptjs

const SALT_ROUNDS = 10

export const findUserByUsername = async (usuario) => {
  try {
    console.log("🟦 Entrando a findUserByUsername con usuario:", usuario)

    if (!usuario) {
      throw new Error("El nombre de usuario está vacío o indefinido")
    }

    const query = "SELECT * FROM usuario WHERE usuario = $1"
    console.log("🟨 Ejecutando query:", query, "con valores:", [usuario])

    const result = await pool.query(query, [usuario])
    console.log("🟩 Resultado de la búsqueda:", result.rows)

    return result.rows[0]
  } catch (error) {
    console.error("❌ Error en findUserByUsername:", error.message)
    throw error
  }
}

export const registerDocenteCompleto = async (data) => {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    console.log("📘 Datos recibidos en el modelo:", data)

    const docenteQuery = `
      INSERT INTO docente (clave, correo, area)
      VALUES ($1, $2, $3)
      RETURNING id_docente, clave, correo, area
    `

    const docenteValues = [data.clave, data.correo, data.area]

    const docenteRes = await client.query(docenteQuery, docenteValues)
    const docente = docenteRes.rows[0]

    console.log("🟩 Docente creado:", docente)

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)
    console.log("🔐 Contraseña hasheada correctamente")

    const usuarioQuery = `
      INSERT INTO usuario (
        nombre,
        primerApellido,
        segundoApellido,
        usuario,
        password,
        id_rol,
        id_docente
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id_usuario, nombre, primerApellido, segundoApellido, usuario, id_rol, id_docente
    `

    const usuarioValues = [
      data.nombre,
      data.primerApellido,
      data.segundoApellido,
      data.usuario,
      hashedPassword,
      data.id_rol,
      docente.id_docente,
    ]

    const usuarioRes = await client.query(usuarioQuery, usuarioValues)
    const usuario = usuarioRes.rows[0]

    console.log("🟩 Usuario creado:", usuario)

    await client.query("COMMIT")

    return { docente, usuario }
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("❌ Error en registro completo:", error)
    throw error
  } finally {
    client.release()
  }
}
