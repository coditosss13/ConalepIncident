import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import incidenciaRoutes from "./src/routes/incidenciaRoutes.js"; // 🟢 IMPORTANTE
import pool from "./src/config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (evidencias)
app.use("/uploads", express.static("uploads")); // 🟢 NECESARIO para acceder a los archivos

// Test de conexión
pool.connect()
  .then(() => console.log("✅ Conectado a PostgreSQL"))
  .catch(err => console.error("❌ Error al conectar a PostgreSQL:", err));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api", incidenciaRoutes); // 🟢 AGREGA LA RUTA AQUÍ

app.get("/", (req, res) => res.send("API Backend - OK"));

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
