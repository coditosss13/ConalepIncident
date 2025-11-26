import jwt from "jsonwebtoken"
import pool from "../config/db.js"

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]

  console.log("[v0] Verificando token:", token ? "Token presente" : "Sin token")

  if (!token) {
    return res.status(403).json({ message: "Token no proporcionado" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const userQuery = await pool.query(
      `SELECT u.*, d.id_docente 
       FROM usuario u 
       LEFT JOIN docente d ON u.id_docente = d.id_docente 
       WHERE u.id_usuario = $1`,
      [decoded.id],
    )

    if (userQuery.rows.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" })
    }

    req.usuario = {
      id_usuario: userQuery.rows[0].id_usuario,
      nombre: userQuery.rows[0].nombre,
      rol: userQuery.rows[0].id_rol,
      id_docente: userQuery.rows[0].id_docente,
    }

    console.log("[v0] Token válido, usuario:", req.usuario.id_usuario, "rol:", req.usuario.rol)

    next()
  } catch (error) {
    console.error("[v0] Error al verificar token:", error.message)
    res.status(401).json({ message: "Token inválido o expirado" })
  }
}

export const permitRoles = (...roles) => {
  return (req, res, next) => {
    console.log("[v0] Verificando permisos. Rol usuario:", req.usuario.rol, "Roles permitidos:", roles)

    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ message: "No tienes permisos para esta acción" })
    }
    next()
  }
}

export const registrarBitacora = (accionDescripcion) => {
  return async (req, res, next) => {
    try {
      const accion = typeof accionDescripcion === "function" ? accionDescripcion(req) : accionDescripcion

      await pool.query(
        `INSERT INTO bitacora (accion, fecha, id_usuario) 
         VALUES ($1, NOW(), $2)`,
        [accion, req.usuario.id_usuario],
      )

      console.log("[v0] ✅ Acción registrada en bitácora:", accion)
    } catch (error) {
      console.error("[v0] ❌ Error al registrar en bitácora:", error.message)
    }

    next()
  }
}
