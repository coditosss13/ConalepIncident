import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import incidenciaRoutes from "./routes/incidenciaRoutes.js"

dotenv.config()
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Servir archivos subidos (evidencias)
app.use("/uploads", express.static("uploads"))

// Rutas principales
app.use("/api/auth", authRoutes)
app.use("/api/incidencias", incidenciaRoutes)

// Ruta base
app.get("/", (req, res) => res.send("API Backend - OK"))

export default app
