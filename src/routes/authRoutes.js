import express from "express";
import { login, registerDocente } from "../controllers/authController.js"; // ⬅️ Agregado register

const router = express.Router();

console.log("🟢 Rutas de autenticación cargadas");

// 🔐 LOGIN
router.post(
  "/login",
  (req, res, next) => {
    console.log("📩 POST /login recibido");
    next();
  },
  login
);

// 🆕 REGISTER
router.post(
  "/register-docente",
  (req, res, next) => {
    console.log("📩 POST /register recibido");
    console.log("📩 Datos recibidos:", req.body);
    next();
  },
  registerDocente
);

export default router;

