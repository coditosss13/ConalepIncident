import jwt from "jsonwebtoken"
import { findUserByUsername, registerDocenteCompleto } from "../models/userModel.js"

// Login
export const login = async (req, res) => {
  try {
    console.log("📩 POST /login recibido")
    console.log("📩 Datos recibidos:", req.body)

    const { usuario, password } = req.body
    const user = await findUserByUsername(usuario)

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" })

    if (password !== user.password) return res.status(401).json({ message: "Contraseña incorrecta" })

    const token = jwt.sign({ id: user.id_usuario, rol: user.id_rol }, process.env.JWT_SECRET || "clave_secreta", {
      expiresIn: "8h",
    })

    res.status(200).json({
      message: "Login exitoso",
      token,
      rol: user.id_rol,
      nombre: `${user.nombre} ${user.primerapellido}`,
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
