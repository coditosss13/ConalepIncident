import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { findUserByUsername, registerDocenteCompleto } from "../models/userModel.js"

// Login
export const login = async (req, res) => {
  try {
    console.log("📩 POST /login recibido")
    console.log("📩 Datos recibidos:", req.body)

    const { usuario, password } = req.body

    if (!usuario || !password) {
      return res.status(400).json({ message: "Usuario y contraseña son requeridos" })
    }

    const user = await findUserByUsername(usuario)

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" })

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" })
    }

    const token = jwt.sign(
      {
        id: user.id_usuario,
        rol: user.id_rol,
        usuario: user.usuario,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    )

    console.log("✅ Token generado correctamente para usuario:", user.usuario)

    res.status(200).json({
      message: "Login exitoso",
      token,
      usuario: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        primerApellido: user.primerApellido,
        segundoApellido: user.segundoApellido,
        usuario: user.usuario,
        id_rol: user.id_rol,
        id_docente: user.id_docente,
      },
    })
  } catch (error) {
    console.error("❌ Error en login:", error.message)
    res.status(500).json({
      message: "Error en el login",
      error: error.message,
    })
  }
}

// Register
export const registerDocente = async (req, res) => {
  console.log("📩 POST /register-docente", req.body)

  try {
    const { password, usuario } = req.body
    if (!password || !usuario) {
      return res.status(400).json({ error: "Usuario y contraseña son requeridos" })
    }

    const result = await registerDocenteCompleto(req.body)

    return res.status(201).json({
      message: "Registro de docente y usuario completado",
      docente: result.docente,
      usuario: result.usuario,
    })
  } catch (error) {
    console.error("❌ Error en registerDocente:", error)
    return res.status(500).json({ error: error.message })
  }
}
