import express from "express"
import multer from "multer"
import { registrarIncidencia, obtenerIncidencias, obtenerIncidenciaPorId } from "../controllers/incidenciaController.js"

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/evidencias")
  },
  filename: (req, file, cb) => {
    const nombreFinal = Date.now() + "-" + file.originalname.replace(/\s+/g, "_")
    cb(null, nombreFinal)
  },
})

const upload = multer({ storage })

router.post("/incidencias", upload.array("evidencias", 10), registrarIncidencia)

router.get("/incidencias", obtenerIncidencias)

router.get("/incidencias/:id", obtenerIncidenciaPorId)

export default router
