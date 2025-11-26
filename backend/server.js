import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import express from "express"
import cors from "cors"
import authRoutes from "./src/routes/authRoutes.js"
import incidenciaRoutes from "./src/routes/incidenciaRoutes.js"
import pool from "./src/config/db.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()

console.log("🔍 Intentando cargar .env desde:", join(__dirname, ".env"))
const result = dotenv.config({ path: join(__dirname, ".env") })

if (result.error) {
  console.error("❌ Error al cargar .env:", result.error)
} else {
  console.log("✅ Archivo .env cargado")
  console.log("📋 Variables cargadas:", Object.keys(result.parsed || {}))
}

console.log("\n🔍 DEBUG Variables de entorno:")
console.log("  - DB_USER:", process.env.DB_USER)
console.log("  - DB_NAME:", process.env.DB_NAME)
console.log("  - PORT:", process.env.PORT)
console.log("  - JWT_SECRET presente:", !!process.env.JWT_SECRET)
console.log("  - JWT_SECRET length:", process.env.JWT_SECRET?.length || 0)

if (!process.env.JWT_SECRET) {
  console.error("\n❌ FATAL: JWT_SECRET no está definido en .env")
  console.error("Por favor verifica que el archivo .env existe y contiene: JWT_SECRET=clave_secreta_123456")
  process.exit(1)
}

console.log("✅ JWT_SECRET cargado correctamente\n")

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(express.json())

// Servir archivos estáticos (evidencias)
app.use("/uploads", express.static("uploads"))

// Test de conexión
pool
  .connect()
  .then(() => console.log("✅ Conectado a PostgreSQL"))
  .catch((err) => console.error("❌ Error al conectar a PostgreSQL:", err))

// Rutas
app.use("/api/auth", authRoutes)
app.use("/api", incidenciaRoutes)

app.get("/", (req, res) => res.send("API Backend - OK"))

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`))
