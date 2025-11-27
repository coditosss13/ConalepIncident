import express from "express"
import multer from "multer"
import {
  registrarIncidencia,
  obtenerIncidencias,
  obtenerIncidenciaPorId,
  obtenerEstadisticasAdmin,
  obtenerEstadisticasDocente,
  obtenerAlumnos,
  obtenerTiposIncidencia,
  obtenerEstadisticasPrefecto,
  obtenerBitacora,
  obtenerUsuarios,
  obtenerReporte,
  obtenerEstadisticasPorPeriodo,
  obtenerRankingGrupos,
  obtenerGruposDocente,
  obtenerAlumnosPorGrupo,
  obtenerAccionesCorrectivas,
} from "../controllers/incidenciaController.js"
import { verifyToken, permitRoles, registrarBitacora } from "../middleware/authMiddleware.js"

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

// === RUTAS ADMINISTRATIVAS (solo admin) ===

router.get("/bitacora", verifyToken, permitRoles(1), obtenerBitacora)
router.get("/usuarios", verifyToken, permitRoles(1), obtenerUsuarios)
router.get("/ranking-grupos", verifyToken, permitRoles(1, 3), obtenerRankingGrupos)

// === ESTADÍSTICAS POR ROL ===

router.get(
  "/stats/admin",
  verifyToken,
  permitRoles(1),
  registrarBitacora("Consultó estadísticas generales"),
  obtenerEstadisticasAdmin,
)

router.get(
  "/stats/prefecto",
  verifyToken,
  permitRoles(3),
  registrarBitacora("Consultó estadísticas de prefectura"),
  obtenerEstadisticasPrefecto,
)

router.get(
  "/stats/docente/:id_usuario",
  verifyToken,
  permitRoles(2),
  registrarBitacora((req) => `Consultó sus estadísticas personales`),
  obtenerEstadisticasDocente,
)

router.get("/stats/periodo", verifyToken, permitRoles(1, 3), obtenerEstadisticasPorPeriodo)

// === REPORTES ===

router.get(
  "/reportes",
  verifyToken,
  permitRoles(1, 3),
  registrarBitacora((req) => {
    const filtros = Object.keys(req.query).join(", ") || "sin filtros"
    return `Generó reporte personalizado (${filtros})`
  }),
  obtenerReporte,
)

// === TIPOS DE INCIDENCIA Y ALUMNOS ===

router.get("/tipos-incidencia", verifyToken, obtenerTiposIncidencia)
router.get("/alumnos", verifyToken, permitRoles(1, 2, 3), obtenerAlumnos)

// === INCIDENCIAS ESPECÍFICAS POR ROL ===

router.get("/mis-incidencias", verifyToken, permitRoles(2), async (req, res) => {
  try {
    const { obtenerIncidenciasPorDocente } = await import("../models/incidenciaModel.js")
    const incidencias = await obtenerIncidenciasPorDocente(req.usuario.id_usuario)
    res.json({ ok: true, data: incidencias })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

router.get("/pendientes", verifyToken, permitRoles(1, 3), async (req, res) => {
  try {
    const { obtenerIncidenciasPendientes } = await import("../models/incidenciaModel.js")
    const incidencias = await obtenerIncidenciasPendientes()
    res.json({ ok: true, data: incidencias })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

// === RUTAS GENERALES ===

router.get("/all", verifyToken, obtenerIncidencias)

router.post(
  "/",
  verifyToken,
  permitRoles(2, 3),
  registrarBitacora((req) => {
    const gravedad = req.body.gravedad || JSON.parse(req.body.data || "{}").gravedad
    return `Registró nueva incidencia (${gravedad})`
  }),
  upload.array("evidencias", 10),
  registrarIncidencia,
)

// === RUTAS CON PARÁMETROS DINÁMICOS ===

router.put(
  "/:id/validar",
  verifyToken,
  permitRoles(1, 3),
  registrarBitacora((req) => `Validó incidencia #${req.params.id}`),
  async (req, res) => {
    try {
      const { id } = req.params
      const { aprobada, observaciones } = req.body
      const { validarIncidencia } = await import("../models/incidenciaModel.js")
      const resultado = await validarIncidencia(id, aprobada, observaciones, req.usuario.id_usuario)
      res.json(resultado)
    } catch (error) {
      res.status(500).json({ ok: false, error: error.message })
    }
  },
)

router.post(
  "/:id/accion-correctiva",
  verifyToken,
  permitRoles(1, 3),
  registrarBitacora((req) => `Aplicó acción correctiva a incidencia #${req.params.id}`),
  async (req, res) => {
    try {
      const { id } = req.params
      const { descripcion, fecha_aplicacion } = req.body
      const { aplicarAccionCorrectiva } = await import("../models/incidenciaModel.js")
      const resultado = await aplicarAccionCorrectiva(
        id,
        descripcion,
        fecha_aplicacion || new Date(),
        req.usuario.id_usuario,
      )
      res.json(resultado)
    } catch (error) {
      res.status(500).json({ ok: false, error: error.message })
    }
  },
)

router.get("/:id", verifyToken, obtenerIncidenciaPorId)

// === RUTAS PARA GRUPOS Y ALUMNOS POR GRUPO ===

router.get("/grupos-docente/:id_docente", verifyToken, permitRoles(2), obtenerGruposDocente)
router.get("/alumnos-grupo/:id_grupo", verifyToken, permitRoles(1, 2, 3), obtenerAlumnosPorGrupo)

// === RUTA PARA ACCIONES CORRECTIVAS ===

router.get("/acciones-correctivas", verifyToken, permitRoles(1, 3), obtenerAccionesCorrectivas)

export default router
