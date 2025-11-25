import express from "express"
import { login, registerDocente } from "../controllers/authController.js"

const router = express.Router()

console.log("🟢 Rutas de autenticación cargadas")

router.post(
  "/login",
  (req, res, next) => {
    console.log("📩 POST /login recibido")
    next()
  },
  login,
)

router.post(
  "/register-docente",
  (req, res, next) => {
    console.log("📩 POST /register recibido")
    console.log("📩 Datos recibidos:", req.body)
    next()
  },
  registerDocente,
)

export default router
