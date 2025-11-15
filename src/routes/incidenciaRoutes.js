import express from "express";
import multer from "multer";
import { registrarIncidencia, obtenerIncidencias, obtenerIncidenciaPorId } from "../controllers/incidenciaController.js";

const router = express.Router();

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/evidencias"); // crea esta carpeta si no existe
    },
    filename: (req, file, cb) => {
        const nombreFinal = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
        cb(null, nombreFinal);
    }
});

const upload = multer({ storage });

// Ruta PRINCIPAL para registrar incidencia + alumnos + evidencias
router.post(
    "/incidencias",
    upload.array("evidencias", 10), // permite hasta 10 archivos
    registrarIncidencia
);

router.get("/incidencias", obtenerIncidencias);

// Obtener una incidencia específica
router.get("/incidencias/:id", obtenerIncidenciaPorId);

export default router;
