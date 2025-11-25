import dotenv from "dotenv"
dotenv.config()   // <-- Cargar primero SIEMPRE

import express from "express"
import cors from "cors"

// IMPORTAR DESPUÉS
import authRoutes from "./src/routes/authRoutes.js"
import incidenciaRoutes from "./src/routes/incidenciaRoutes.js"
import pool from "./src/config/db.js"


console.log("PASSWORD DEL ENV:", process.env.DB_PASSWORD)

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use("/uploads", express.static("uploads"))

pool
  .connect()
  .then(() => console.log("✅ Conectado a PostgreSQL"))
  .catch((err) => console.error("❌ Error al conectar a PostgreSQL:", err))

app.use("/api/auth", authRoutes)
app.use("/api", incidenciaRoutes)

app.get("/", (req, res) => res.send("API Backend - OK"))

app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
)
