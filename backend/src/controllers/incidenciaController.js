import {
  registrarIncidenciaCompleta,
  obtenerIncidencia as obtenerIncidenciaDB,
  obtenerIncidenciaPorId as obtenerIncidenciaPorIdDB,
  obtenerIncidenciasPorDocente as obtenerIncidenciasPorDocenteDB,
  obtenerIncidenciasPendientes as obtenerIncidenciasPendientesDB,
  validarIncidencia as validarIncidenciaDB,
  aplicarAccionCorrectiva as aplicarAccionCorrectivaDB,
  obtenerEstadisticasAdmin as getStatsAdmin,
  obtenerEstadisticasCoordinador as getStatsCoord,
  obtenerEstadisticasDocente as getStatsDoc,
  obtenerTodosLosAlumnos as getAllAlumnos,
  obtenerAlumnosPorDocente as getAlumnosByDocente,
  obtenerTiposIncidencia as getTiposIncidencia,
  obtenerBitacora as getBitacora,
  obtenerUsuariosConStats as getUsersWithStats,
  obtenerReportePersonalizado as getCustomReport,
  obtenerEstadisticasPorPeriodo as getStatsByPeriod,
  obtenerRankingGrupos as getGroupRanking,
} from "../models/incidenciaModel.js"
import pool from "../config/db.js"

export const registrarIncidencia = async (req, res) => {
  try {
    let incidenciaData
    let alumnos = []
    let evidencias = []

    if (req.headers["content-type"]?.includes("multipart/form-data")) {
      incidenciaData = JSON.parse(req.body.data)
      alumnos = JSON.parse(req.body.alumnos || "[]")
      evidencias = req.files || []
    } else {
      incidenciaData = req.body
      alumnos = req.body.alumnos || []
      evidencias = []
    }

    const resultado = await registrarIncidenciaCompleta(incidenciaData, alumnos, evidencias)

    res.status(200).json({
      ok: true,
      mensaje: "Incidencia registrada correctamente",
      data: resultado,
    })
  } catch (err) {
    console.error("❌ Error en controlador registrarIncidencia:", err)
    res.status(500).json({ ok: false, error: err.message })
  }
}

export const obtenerIncidencias = async (req, res) => {
  try {
    console.log("[v0] Usuario autenticado:", req.usuario)
    const data = await obtenerIncidenciaDB()
    console.log("[v0] Incidencias obtenidas de la BD:", data?.length || 0)

    res.json({ ok: true, data: data || [] })
  } catch (err) {
    console.error("❌ Error al obtener incidencias:", err)
    res.status(500).json({ ok: false, error: err.message })
  }
}

export const obtenerIncidenciaPorId = async (req, res) => {
  try {
    const id = req.params.id

    console.log("[v0] Intentando obtener incidencia con ID:", id)

    if (isNaN(id) || !Number.isInteger(Number(id))) {
      console.log("[v0] ⚠️ ID inválido recibido:", id)
      return res.status(400).json({
        ok: false,
        error: "ID de incidencia inválido. Debe ser un número entero.",
      })
    }

    const data = await obtenerIncidenciaPorIdDB(id)

    if (!data) {
      return res.status(404).json({
        ok: false,
        mensaje: "Incidencia no encontrada",
      })
    }

    res.json({ ok: true, data })
  } catch (err) {
    console.error("❌ Error al obtener incidencia por ID:", err)
    res.status(500).json({ ok: false, error: err.message })
  }
}

export const obtenerIncidenciasPorDocente = async (req, res) => {
  try {
    const id_usuario = req.params.id_usuario
    const data = await obtenerIncidenciasPorDocenteDB(id_usuario)
    res.json({ ok: true, data })
  } catch (err) {
    console.error("Error al obtener incidencias por docente:", err)
    res.status(500).json({ ok: false, error: err.message })
  }
}

export const obtenerIncidenciasPendientes = async (req, res) => {
  try {
    const data = await obtenerIncidenciasPendientesDB()
    res.json({ ok: true, data })
  } catch (err) {
    console.error("Error al obtener incidencias pendientes:", err)
    res.status(500).json({ ok: false, error: err.message })
  }
}

export const validarIncidencia = async (req, res) => {
  try {
    const id_incidencia = req.params.id_incidencia
    const aprobada = req.body.aprobada
    const observaciones = req.body.observaciones
    const id_usuario = req.body.id_usuario
    const resultado = await validarIncidenciaDB(id_incidencia, aprobada, observaciones, id_usuario)
    res.json({ ok: true, resultado })
  } catch (err) {
    console.error("Error al validar incidencia:", err)
    res.status(500).json({ ok: false, error: err.message })
  }
}

export const aplicarAccionCorrectiva = async (req, res) => {
  try {
    const id_incidencia = req.params.id_incidencia
    const descripcion = req.body.descripcion
    const fecha_aplicacion = req.body.fecha_aplicacion
    const id_usuario = req.body.id_usuario
    const resultado = await aplicarAccionCorrectivaDB(id_incidencia, descripcion, fecha_aplicacion, id_usuario)
    res.json({ ok: true, resultado })
  } catch (err) {
    console.error("Error al aplicar acción correctiva:", err)
    res.status(500).json({ ok: false, error: err.message })
  }
}

export const obtenerEstadisticasAdmin = async (req, res) => {
  try {
    console.log("[v0] 📊 Obteniendo estadísticas de administrador...")

    const stats = await getStatsAdmin()

    console.log("[v0] ✅ Estadísticas obtenidas del modelo")
    console.log("[v0] 📦 Datos:", JSON.stringify(stats, null, 2))

    res.json({
      ok: true,
      stats: stats,
    })
  } catch (err) {
    console.error("[v0] ❌ Error en obtenerEstadisticasAdmin:", err)
    res.status(500).json({
      ok: false,
      error: err.message,
    })
  }
}

// Ya no se usa, ahora solo existe obtenerEstadisticasPrefecto

export const obtenerEstadisticasPrefecto = async (req, res) => {
  try {
    console.log("[v0] 📊 Ejecutando obtenerEstadisticasPrefecto...")
    const stats = await getStatsCoord()
    console.log("[v0] ✅ Estadísticas de prefecto obtenidas exitosamente:", Object.keys(stats))
    res.json({ ok: true, stats })
  } catch (err) {
    console.error("[v0] ❌ Error al obtener estadísticas prefecto:", err)
    res.status(500).json({ ok: false, error: err.message })
  }
}

export const obtenerEstadisticasDocente = async (req, res) => {
  try {
    const id_usuario = req.params.id_usuario
    const stats = await getStatsDoc(id_usuario)
    res.json({ ok: true, stats })
  } catch (err) {
    console.error("Error al obtener estadísticas docente:", err)
    res.status(500).json({ ok: false, error: err.message })
  }
}

export const obtenerAlumnos = async (req, res) => {
  try {
    const usuario = req.usuario // Viene del middleware de autenticación

    // Si es coordinador (rol 3) o administrador (rol 1), obtiene todos los alumnos
    if (usuario.rol === 1 || usuario.rol === 3) {
      const alumnos = await getAllAlumnos()
      return res.json({ ok: true, data: alumnos })
    }

    // Si es docente (rol 2), obtiene solo alumnos de sus grupos
    if (usuario.rol === 2) {
      if (!usuario.id_docente) {
        return res.status(400).json({ ok: false, error: "El usuario docente no tiene id_docente asignado" })
      }
      const alumnos = await getAlumnosByDocente(usuario.id_docente)
      return res.json({ ok: true, data: alumnos })
    }

    return res.status(403).json({ ok: false, error: "No tiene permisos para ver alumnos" })
  } catch (err) {
    console.error("Error al obtener alumnos:", err)
    res.status(500).json({ ok: false, error: err.message })
  }
}

export const obtenerTiposIncidencia = async (req, res) => {
  try {
    const tipos = await getTiposIncidencia()
    res.json({ ok: true, data: tipos })
  } catch (err) {
    console.error("Error al obtener tipos de incidencia:", err)
    res.status(500).json({ ok: false, error: err.message })
  }
}

export const obtenerBitacora = async (req, res) => {
  try {
    const filtros = {
      id_usuario: req.query.id_usuario,
      fecha_desde: req.query.fecha_desde,
      fecha_hasta: req.query.fecha_hasta,
    }

    const bitacora = await getBitacora(filtros)
    res.json({ ok: true, data: bitacora })
  } catch (err) {
    console.error("Error al obtener bitácora:", err)
    res.status(500).json({ ok: false, error: err.message })
  }
}

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await getUsersWithStats()
    res.json({ ok: true, data: usuarios })
  } catch (err) {
    console.error("Error al obtener usuarios:", err)
    res.status(500).json({ ok: false, error: err.message })
  }
}

export const obtenerReporte = async (req, res) => {
  try {
    const filtros = {
      fecha_desde: req.query.fecha_desde,
      fecha_hasta: req.query.fecha_hasta,
      gravedad: req.query.gravedad,
      estado: req.query.estado,
      id_tipo: req.query.id_tipo,
      id_grupo: req.query.id_grupo,
    }

    const reporte = await getCustomReport(filtros)
    res.json({ ok: true, data: reporte })
  } catch (err) {
    console.error("Error al obtener reporte:", err)
    res.status(500).json({ ok: false, error: err.message })
  }
}

export const obtenerEstadisticasPorPeriodo = async (req, res) => {
  try {
    const stats = await getStatsByPeriod()
    res.json({ ok: true, data: stats })
  } catch (err) {
    console.error("Error al obtener estadísticas por periodo:", err)
    res.status(500).json({ ok: false, error: err.message })
  }
}

export const obtenerRankingGrupos = async (req, res) => {
  try {
    const ranking = await getGroupRanking()
    res.json({ ok: true, data: ranking })
  } catch (err) {
    console.error("Error al obtener ranking de grupos:", err)
    res.status(500).json({ ok: false, error: err.message })
  }
}

export const obtenerGruposDocente = async (req, res) => {
  try {
    const { id_docente } = req.params

    const result = await pool.query(
      `SELECT g.id_grupo, g.nombre, g.grado, g.periodo
       FROM grupo g
       INNER JOIN docente_grupo dg ON g.id_grupo = dg.id_grupo
       WHERE dg.id_docente = $1
       ORDER BY g.nombre`,
      [id_docente],
    )

    res.json({ ok: true, data: result.rows })
  } catch (err) {
    console.error("Error al obtener grupos del docente:", err)
    res.status(500).json({ ok: false, error: err.message })
  }
}

export const obtenerAlumnosPorGrupo = async (req, res) => {
  try {
    const { id_grupo } = req.params

    const result = await pool.query(
      `SELECT 
        a.id_alumno,
        a.nombre,
        a.primerApellido,
        a.segundoApellido,
        a.matricula,
        g.nombre as grupo_nombre,
        g.grado,
        g.periodo
       FROM alumno a
       INNER JOIN grupo g ON a.id_grupo = g.id_grupo
       WHERE a.id_grupo = $1
       ORDER BY a.primerApellido, a.nombre`,
      [id_grupo],
    )

    res.json({ ok: true, data: result.rows })
  } catch (err) {
    console.error("Error al obtener alumnos del grupo:", err)
    res.status(500).json({ ok: false, error: err.message })
  }
}

export const obtenerAccionesCorrectivas = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        ac.id_accion,
        ac.descripcion,
        ac.fechaAplicacion,
        i.id_incidencia,
        i.gravedad,
        i.estado,
        ti.nombre as tipo_incidencia,
        u.nombre as usuario_nombre,
        u.primerApellido as usuario_apellido,
        STRING_AGG(
          CONCAT(a.nombre, ' ', a.primerApellido, ' ', COALESCE(a.segundoApellido, '')),
          ', '
        ) as alumnos
       FROM acc_correctiva ac
       INNER JOIN incidencia i ON ac.id_incidencia = i.id_incidencia
       INNER JOIN tipo_incidencia ti ON i.id_tipoIncidencia = ti.id_tipoIncidencia
       INNER JOIN usuario u ON ac.id_usuario = u.id_usuario
       LEFT JOIN alumno_incidencia ai ON i.id_incidencia = ai.id_incidencia
       LEFT JOIN alumno a ON ai.id_alumno = a.id_alumno
       GROUP BY ac.id_accion, ac.descripcion, ac.fechaAplicacion, 
                i.id_incidencia, i.gravedad, i.estado, ti.nombre,
                u.nombre, u.primerApellido
       ORDER BY ac.fechaAplicacion DESC
       LIMIT 100`,
      [],
    )

    res.json({ ok: true, data: result.rows })
  } catch (err) {
    console.error("Error al obtener acciones correctivas:", err)
    res.status(500).json({ ok: false, error: err.message })
  }
}
