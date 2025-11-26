import express from "express"
import cors from "cors"
import authRoutes from "./routes/authRoutes.js"
import incidenciaRoutes from "./routes/incidenciaRoutes.js"

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  console.log(`[v0] 📡 ${req.method} ${req.url}`)
  next()
})

// Servir archivos subidos (evidencias)
app.use("/uploads", express.static("uploads"))

// Rutas principales
app.use("/api/auth", authRoutes)
app.use("/api/incidencias", incidenciaRoutes)

// Ruta base
app.get("/", (req, res) => res.send("API Backend - OK"))

export default app
