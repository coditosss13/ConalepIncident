import pool from "../config/db.js"

export const registrarIncidenciaCompleta = async (incidenciaData, alumnos, evidencias) => {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const incidenciaQuery = `
            INSERT INTO incidencia (gravedad, observaciones, estado, fecha, id_usuario, id_tipoIncidencia)
            VALUES ($1, $2, $3, NOW(), $4, $5)
            RETURNING id_incidencia;
        `

    const incidenciaResult = await client.query(incidenciaQuery, [
      incidenciaData.gravedad,
      incidenciaData.observaciones,
      incidenciaData.estado || "Pendiente",
      incidenciaData.id_usuario,
      incidenciaData.id_tipoIncidencia,
    ])

    const idIncidencia = incidenciaResult.rows[0].id_incidencia

    for (const alumno of alumnos) {
      await client.query(
        `INSERT INTO alumno_incidencia (id_alumno, id_incidencia)
         VALUES ($1, $2)`,
        [alumno.id_alumno, idIncidencia],
      )
    }

    for (const file of evidencias) {
      await client.query(
        `INSERT INTO evidencia (archivo, tipoArchivo, fechaSubida, id_incidencia)
         VALUES ($1, $2, NOW(), $3)`,
        [file.filename, file.mimetype, idIncidencia],
      )
    }

    await client.query("COMMIT")

    return { ok: true, id_incidencia: idIncidencia }
  } catch (err) {
    await client.query("ROLLBACK")
    console.error("❌ Error en registro de incidencia completa:", err)
    throw err
  } finally {
    client.release()
  }
}

export const obtenerIncidencia = async () => {
  const query = `
        SELECT 
            i.id_incidencia,
            i.gravedad,
            i.observaciones,
            i.estado,
            i.fecha,
            u.nombre AS usuario,
            t.nombre AS tipo_incidencia
        FROM incidencia i
        INNER JOIN usuario u ON u.id_usuario = i.id_usuario
        INNER JOIN tipo_incidencia t ON t.id_tipoIncidencia = i.id_tipoIncidencia
        ORDER BY i.id_incidencia DESC;
    `

  const result = await pool.query(query)
  return result.rows
}

export const obtenerIncidenciaPorId = async (id) => {
  const incidenciaQuery = `
    SELECT 
        i.*,
        u.nombre || ' ' || u.primerApellido AS usuario,
        ti.nombre AS tipo_incidencia,
        ti.categoria
    FROM incidencia i
    INNER JOIN usuario u ON u.id_usuario = i.id_usuario
    INNER JOIN tipo_incidencia ti ON ti.id_tipoIncidencia = i.id_tipoIncidencia
    WHERE i.id_incidencia = $1;
    `

  const incidenciaResult = await pool.query(incidenciaQuery, [id])

  if (incidenciaResult.rowCount === 0) return null

  const alumnosQuery = `
        SELECT a.id_alumno, a.nombre, a.primerApellido, a.segundoApellido, a.matricula, g.nombre AS grupo
        FROM alumno_incidencia ai
        INNER JOIN alumno a ON a.id_alumno = ai.id_alumno
        LEFT JOIN grupo g ON a.id_grupo = g.id_grupo
        WHERE ai.id_incidencia = $1;
    `
  const alumnosResult = await pool.query(alumnosQuery, [id])

  const evidenciaQuery = `
        SELECT id_evidencia, archivo, tipoArchivo, fechaSubida
        FROM evidencia
        WHERE id_incidencia = $1;
    `
  const evidenciaResult = await pool.query(evidenciaQuery, [id])

  const accionesQuery = `
        SELECT ac.id_accion, ac.descripcion, ac.fechaAplicacion,
               u.nombre || ' ' || u.primerApellido AS aplicada_por
        FROM acc_correctiva ac
        INNER JOIN usuario u ON ac.id_usuario = u.id_usuario
        WHERE ac.id_incidencia = $1
        ORDER BY ac.fechaAplicacion DESC;
    `
  const accionesResult = await pool.query(accionesQuery, [id])

  return {
    ...incidenciaResult.rows[0],
    alumnos: alumnosResult.rows,
    evidencias: evidenciaResult.rows,
    acciones_correctivas: accionesResult.rows,
  }
}

export const obtenerIncidenciasPorDocente = async (id_usuario) => {
  const query = `
    SELECT 
      i.id_incidencia,
      i.gravedad,
      i.observaciones,
      i.estado,
      i.fecha,
      u.nombre AS usuario,
      t.nombre AS tipo_incidencia
    FROM incidencia i
    INNER JOIN usuario u ON u.id_usuario = i.id_usuario
    INNER JOIN tipo_incidencia t ON t.id_tipoIncidencia = i.id_tipoIncidencia
    WHERE i.id_usuario = $1
    ORDER BY i.fecha DESC;
  `

  const result = await pool.query(query, [id_usuario])
  return result.rows
}

export const obtenerIncidenciasPendientes = async () => {
  const query = `
    SELECT 
      i.id_incidencia,
      i.gravedad,
      i.observaciones,
      i.estado,
      i.fecha,
      u.nombre AS usuario,
      t.nombre AS tipo_incidencia
    FROM incidencia i
    INNER JOIN usuario u ON u.id_usuario = i.id_usuario
    INNER JOIN tipo_incidencia t ON t.id_tipoIncidencia = i.id_tipoIncidencia
    WHERE i.estado = 'Pendiente'
    ORDER BY i.fecha DESC;
  `

  const result = await pool.query(query)
  return result.rows
}

export const validarIncidencia = async (id_incidencia, aprobada, observaciones, id_usuario) => {
  const client = await pool.connect()
  
  try {
    await client.query("BEGIN")

    const nuevoEstado = aprobada ? 'Aprobada' : 'Rechazada'
    
    const updateQuery = `
      UPDATE incidencia 
      SET estado = $1, 
          observaciones = COALESCE($2, observaciones)
      WHERE id_incidencia = $3
      RETURNING *;
    `
    
    const result = await client.query(updateQuery, [nuevoEstado, observaciones, id_incidencia])

    await client.query(
      `INSERT INTO bitacora (accion, id_usuario, fecha)
       VALUES ($1, $2, NOW())`,
      [`Validó incidencia #${id_incidencia} como ${nuevoEstado}`, id_usuario]
    )

    await client.query("COMMIT")
    
    return result.rows[0]
  } catch (err) {
    await client.query("ROLLBACK")
    console.error("Error al validar incidencia:", err)
    throw err
  } finally {
    client.release()
  }
}

export const obtenerEstadisticasAdmin = async () => {
  // ... resto del código
  try {
    console.log("[v0] 📊 Obteniendo estadísticas de administrador...")

    const incidenciasPorTipo = await pool.query(`
      SELECT 
        ti.categoria AS tipo,
        COUNT(i.id_incidencia) AS cantidad
      FROM tipo_incidencia ti
      LEFT JOIN incidencia i ON i.id_tipoIncidencia = ti.id_tipoIncidencia
      GROUP BY ti.categoria
      HAVING COUNT(i.id_incidencia) > 0
      ORDER BY cantidad DESC
    `)

    const tendenciasPorMes = await pool.query(`
      SELECT 
        TO_CHAR(fecha, 'Mon') AS mes,
        EXTRACT(MONTH FROM fecha) AS mes_numero,
        COUNT(*) AS total,
        SUM(CASE WHEN gravedad = 'Grave' THEN 1 ELSE 0 END) AS criticas
      FROM incidencia
      WHERE fecha >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(fecha, 'Mon'), EXTRACT(MONTH FROM fecha)
      ORDER BY mes_numero
    `)

    const alumnosConMasIncidencias = await pool.query(`
      SELECT 
        a.id_alumno,
        a.nombre || ' ' || a.primerApellido || COALESCE(' ' || a.segundoApellido, '') AS nombre_completo,
        g.nombre AS grupo,
        COUNT(ai.id_incidencia) AS total_incidencias
      FROM alumno a
      INNER JOIN alumno_incidencia ai ON a.id_alumno = ai.id_alumno
      LEFT JOIN grupo g ON a.id_grupo = g.id_grupo
      GROUP BY a.id_alumno, nombre_completo, g.nombre
      ORDER BY total_incidencias DESC
      LIMIT 10
    `)

    // Total de incidencias
    const totalIncidencias = await pool.query("SELECT COUNT(*) as total FROM incidencia")

    // Incidencias pendientes
    const pendientes = await pool.query("SELECT COUNT(*) as total FROM incidencia WHERE estado = 'Pendiente'")

    // Incidencias resueltas
    const resueltas = await pool.query("SELECT COUNT(*) as total FROM incidencia WHERE estado = 'Resuelta'")

    // Incidencias graves
    const graves = await pool.query("SELECT COUNT(*) as total FROM incidencia WHERE gravedad = 'Grave'")

    // Incidencias por gravedad
    const incidenciasPorGravedad = await pool.query(`
      SELECT 
        gravedad,
        COUNT(*) as cantidad
      FROM incidencia
      GROUP BY gravedad
    `)

    // Incidencias por estado
    const incidenciasPorEstado = await pool.query(`
      SELECT 
        estado,
        COUNT(*) as cantidad
      FROM incidencia
      GROUP BY estado
    `)

    // Incidencias por grupo
    const incidenciasPorGrupo = await pool.query(`
      SELECT 
        g.nombre AS grupo,
        COUNT(ai.id_incidencia) AS total_incidencias
      FROM grupo g
      LEFT JOIN alumno a ON g.id_grupo = a.id_grupo
      LEFT JOIN alumno_incidencia ai ON a.id_alumno = ai.id_alumno
      GROUP BY g.nombre
      HAVING COUNT(ai.id_incidencia) > 0
      ORDER BY total_incidencias DESC
      LIMIT 10
    `)

    const actividadUsuarios = await pool.query(`
      SELECT 
        'Incidencia registrada' AS accion,
        i.fecha,
        u.nombre || ' ' || u.primerApellido AS usuario
      FROM incidencia i
      INNER JOIN usuario u ON i.id_usuario = u.id_usuario
      ORDER BY i.fecha DESC
      LIMIT 10
    `)

    const resultado = {
      totalIncidencias: Number.parseInt(totalIncidencias.rows[0].total) || 0,
      pendientes: Number.parseInt(pendientes.rows[0].total) || 0,
      resueltas: Number.parseInt(resueltas.rows[0].total) || 0,
      graves: Number.parseInt(graves.rows[0].total) || 0,
      incidenciasPorTipo: incidenciasPorTipo.rows || [],
      incidenciasPorGravedad: incidenciasPorGravedad.rows || [],
      alumnosConMasIncidencias: alumnosConMasIncidencias.rows || [],
      tendenciasPorMes: tendenciasPorMes.rows || [],
      incidenciasPorEstado: incidenciasPorEstado.rows || [],
      actividadUsuarios: actividadUsuarios.rows || [],
      incidenciasPorGrupo: incidenciasPorGrupo.rows || [],
    }

    console.log("[v0] ✅ Estadísticas obtenidas:", JSON.stringify(resultado, null, 2))

    return resultado
  } catch (err) {
    console.error("[v0] ❌ Error al obtener estadísticas admin:", err)
    return {
      totalIncidencias: 0,
      pendientes: 0,
      resueltas: 0,
      graves: 0,
      incidenciasPorTipo: [],
      incidenciasPorGravedad: [],
      alumnosConMasIncidencias: [],
      tendenciasPorMes: [],
      incidenciasPorEstado: [],
      actividadUsuarios: [],
      incidenciasPorGrupo: [],
    }
  }
}

export const obtenerEstadisticasCoordinador = async () => {
  try {
    // Total de incidencias pendientes
    const pendientes = await pool.query("SELECT COUNT(*) as total FROM incidencia WHERE estado = 'Pendiente'")

    // Total de incidencias resueltas
    const resueltas = await pool.query("SELECT COUNT(*) as total FROM incidencia WHERE estado = 'Resuelta'")

    // Incidencias por tipo
    const incidenciasPorTipo = await pool.query(`
      SELECT 
        ti.nombre AS tipo,
        COUNT(i.id_incidencia) AS cantidad
      FROM tipo_incidencia ti
      LEFT JOIN incidencia i ON i.id_tipoIncidencia = ti.id_tipoIncidencia
      GROUP BY ti.nombre
      ORDER BY cantidad DESC
    `)

    // Incidencias graves pendientes
    const gravesPendientes = await pool.query(`
      SELECT COUNT(*) as total 
      FROM incidencia 
      WHERE gravedad = 'Grave' AND estado = 'Pendiente'
    `)

    // Últimas 10 incidencias pendientes
    const ultimasPendientes = await pool.query(`
      SELECT 
        i.id_incidencia,
        i.gravedad,
        i.observaciones,
        i.fecha,
        ti.nombre AS tipo,
        u.nombre || ' ' || u.primerApellido AS docente,
        COALESCE(STRING_AGG(a.nombre || ' ' || a.primerApellido, ', '), 'Sin alumno') AS alumno
      FROM incidencia i
      INNER JOIN tipo_incidencia ti ON i.id_tipoIncidencia = ti.id_tipoIncidencia
      INNER JOIN usuario u ON i.id_usuario = u.id_usuario
      LEFT JOIN alumno_incidencia ai ON i.id_incidencia = ai.id_incidencia
      LEFT JOIN alumno a ON ai.id_alumno = a.id_alumno
      WHERE i.estado = 'Pendiente'
      GROUP BY i.id_incidencia, i.gravedad, i.observaciones, i.fecha, ti.nombre, u.nombre, u.primerApellido
      ORDER BY i.fecha DESC
      LIMIT 10
    `)

    // Tendencias por mes
    const tendenciasPorMes = await pool.query(`
      SELECT 
        TO_CHAR(fecha, 'Mon') AS mes,
        COUNT(*) AS total
      FROM incidencia
      WHERE fecha >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(fecha, 'Mon'), EXTRACT(MONTH FROM fecha)
      ORDER BY EXTRACT(MONTH FROM fecha)
    `)

    return {
      totalPendientes: Number.parseInt(pendientes.rows[0].total),
      totalResueltas: Number.parseInt(resueltas.rows[0].total),
      incidenciasPorTipo: incidenciasPorTipo.rows,
      gravesPendientes: Number.parseInt(gravesPendientes.rows[0].total),
      ultimasPendientes: ultimasPendientes.rows,
      tendenciasPorMes: tendenciasPorMes.rows,
    }
  } catch (err) {
    console.error("Error al obtener estadísticas coordinador:", err)
    throw err
  }
}

export const obtenerEstadisticasDocente = async (id_usuario) => {
  try {
    // Total de incidencias generadas por el docente
    const totalIncidencias = await pool.query("SELECT COUNT(*) as total FROM incidencia WHERE id_usuario = $1", [
      id_usuario,
    ])

    // Incidencias graves del docente
    const incidenciasGraves = await pool.query(
      "SELECT COUNT(*) as total FROM incidencia WHERE id_usuario = $1 AND gravedad = 'Grave'",
      [id_usuario],
    )

    // Incidencias pendientes del docente
    const incidenciasPendientes = await pool.query(
      "SELECT COUNT(*) as total FROM incidencia WHERE id_usuario = $1 AND estado = 'Pendiente'",
      [id_usuario],
    )

    // Tipos de incidencias más comunes del docente
    const tiposComunes = await pool.query(
      `
      SELECT 
        ti.nombre AS tipo,
        COUNT(i.id_incidencia) AS cantidad
      FROM incidencia i
      INNER JOIN tipo_incidencia ti ON i.id_tipoIncidencia = ti.id_tipoIncidencia
      WHERE i.id_usuario = $1
      GROUP BY ti.nombre
      ORDER BY cantidad DESC
    `,
      [id_usuario],
    )

    // Top 5 alumnos con más incidencias (solo del docente)
    const alumnosConMasIncidencias = await pool.query(
      `
      SELECT 
        a.id_alumno,
        a.nombre || ' ' || a.primerApellido || COALESCE(' ' || a.segundoApellido, '') AS nombre_completo,
        g.nombre AS grupo,
        COUNT(ai.id_incidencia) AS total_incidencias
      FROM alumno a
      INNER JOIN alumno_incidencia ai ON a.id_alumno = ai.id_alumno
      INNER JOIN incidencia i ON ai.id_incidencia = i.id_incidencia
      LEFT JOIN grupo g ON a.id_grupo = g.id_grupo
      WHERE i.id_usuario = $1
      GROUP BY a.id_alumno, nombre_completo, g.nombre
      ORDER BY total_incidencias DESC
      LIMIT 5
    `,
      [id_usuario],
    )

    // Tendencias semanales (últimas 4 semanas)
    const tendenciasSemana = await pool.query(
      `
      SELECT 
        TO_CHAR(fecha, 'W') AS semana,
        COUNT(*) AS total
      FROM incidencia
      WHERE id_usuario = $1 AND fecha >= NOW() - INTERVAL '4 weeks'
      GROUP BY TO_CHAR(fecha, 'W')
      ORDER BY TO_CHAR(fecha, 'W')
    `,
      [id_usuario],
    )

    // Últimos registros de estudiantes (últimas 10 incidencias)
    const ultimosRegistros = await pool.query(
      `
      SELECT 
        i.id_incidencia,
        i.gravedad,
        i.observaciones,
        i.fecha,
        ti.nombre AS tipo,
        COALESCE(STRING_AGG(a.nombre || ' ' || a.primerApellido, ', '), 'Sin alumno') AS alumno
      FROM incidencia i
      INNER JOIN tipo_incidencia ti ON i.id_tipoIncidencia = ti.id_tipoIncidencia
      LEFT JOIN alumno_incidencia ai ON i.id_incidencia = ai.id_incidencia
      LEFT JOIN alumno a ON ai.id_alumno = a.id_alumno
      WHERE i.id_usuario = $1
      GROUP BY i.id_incidencia, i.gravedad, i.observaciones, i.fecha, ti.nombre
      ORDER BY i.fecha DESC
      LIMIT 10
    `,
      [id_usuario],
    )

    return {
      totalIncidencias: Number.parseInt(totalIncidencias.rows[0].total),
      incidenciasGraves: Number.parseInt(incidenciasGraves.rows[0].total),
      incidenciasPendientes: Number.parseInt(incidenciasPendientes.rows[0].total),
      tiposComunes: tiposComunes.rows,
      alumnosConMasIncidencias: alumnosConMasIncidencias.rows,
      tendenciasSemana: tendenciasSemana.rows,
      ultimosRegistros: ultimosRegistros.rows,
    }
  } catch (err) {
    console.error("Error al obtener estadísticas docente:", err)
    throw err
  }
}

export const obtenerTodosLosAlumnos = async () => {
  const query = `
    SELECT 
      a.id_alumno,
      a.nombre,
      a.primerApellido,
      a.segundoApellido,
      a.matricula,
      g.nombre AS grupo,
      g.grado,
      g.periodo
    FROM alumno a
    LEFT JOIN grupo g ON a.id_grupo = g.id_grupo
    ORDER BY a.nombre, a.primerApellido
  `

  const result = await pool.query(query)
  return result.rows
}

export const obtenerAlumnosPorDocente = async (id_docente) => {
  const query = `
    SELECT DISTINCT
      a.id_alumno,
      a.nombre,
      a.primerApellido,
      a.segundoApellido,
      a.matricula,
      g.nombre AS grupo,
      g.grado,
      g.periodo
    FROM alumno a
    INNER JOIN grupo g ON a.id_grupo = g.id_grupo
    INNER JOIN docente_grupo dg ON g.id_grupo = dg.id_grupo
    WHERE dg.id_docente = $1
    ORDER BY g.nombre, a.nombre, a.primerApellido
  `

  const result = await pool.query(query, [id_docente])
  return result.rows
}

export const obtenerTiposIncidencia = async () => {
  const query = `
    SELECT 
      id_tipoIncidencia,
      nombre,
      categoria
    FROM tipo_incidencia
    ORDER BY categoria, nombre
  `

  const result = await pool.query(query)
  return result.rows
}

export const obtenerBitacora = async (filtros = {}) => {
  let query = `
    SELECT 
      b.id_bitacora,
      b.accion,
      b.fecha,
      u.nombre || ' ' || u.primerApellido AS usuario,
      r.nombre AS rol
    FROM bitacora b
    INNER JOIN usuario u ON b.id_usuario = u.id_usuario
    INNER JOIN rol r ON u.id_rol = r.id_rol
    WHERE 1=1
  `

  const params = []
  let paramCount = 1

  if (filtros.id_usuario) {
    query += ` AND b.id_usuario = $${paramCount}`
    params.push(filtros.id_usuario)
    paramCount++
  }

  if (filtros.fecha_desde) {
    query += ` AND b.fecha >= $${paramCount}`
    params.push(filtros.fecha_desde)
    paramCount++
  }

  if (filtros.fecha_hasta) {
    query += ` AND b.fecha <= $${paramCount}`
    params.push(filtros.fecha_hasta)
    paramCount++
  }

  query += ` ORDER BY b.fecha DESC LIMIT 100`

  const result = await pool.query(query, params)
  return result.rows
}

export const obtenerUsuariosConStats = async () => {
  const query = `
    SELECT 
      u.id_usuario,
      u.nombre,
      u.primerApellido,
      u.segundoApellido,
      u.usuario,
      r.nombre AS rol,
      d.clave AS clave_docente,
      d.correo,
      d.area,
      COUNT(DISTINCT i.id_incidencia) AS total_incidencias_registradas,
      COUNT(DISTINCT CASE WHEN i.estado = 'Pendiente' THEN i.id_incidencia END) AS pendientes
    FROM usuario u
    INNER JOIN rol r ON u.id_rol = r.id_rol
    LEFT JOIN docente d ON u.id_docente = d.id_docente
    LEFT JOIN incidencia i ON i.id_usuario = u.id_usuario
    GROUP BY u.id_usuario, u.nombre, u.primerApellido, u.segundoApellido, 
             u.usuario, r.nombre, d.clave, d.correo, d.area
    ORDER BY r.id_rol, u.nombre
  `

  const result = await pool.query(query)
  return result.rows
}

export const obtenerReportePersonalizado = async (filtros) => {
  let query = `
    SELECT 
      i.id_incidencia,
      i.gravedad,
      i.observaciones,
      i.estado,
      i.fecha,
      ti.nombre AS tipo_incidencia,
      ti.categoria,
      u.nombre || ' ' || u.primerApellido AS registrado_por,
      STRING_AGG(
        a.nombre || ' ' || a.primerApellido || 
        COALESCE(' ' || a.segundoApellido, ''), 
        ', '
      ) AS alumnos,
      STRING_AGG(DISTINCT g.nombre, ', ') AS grupos,
      COUNT(DISTINCT e.id_evidencia) AS total_evidencias,
      COUNT(DISTINCT ac.id_accion) AS total_acciones
    FROM incidencia i
    INNER JOIN usuario u ON i.id_usuario = u.id_usuario
    INNER JOIN tipo_incidencia ti ON i.id_tipoIncidencia = ti.id_tipoIncidencia
    LEFT JOIN alumno_incidencia ai ON i.id_incidencia = ai.id_incidencia
    LEFT JOIN alumno a ON ai.id_alumno = a.id_alumno
    LEFT JOIN grupo g ON a.id_grupo = g.id_grupo
    LEFT JOIN evidencia e ON i.id_incidencia = e.id_incidencia
    LEFT JOIN acc_correctiva ac ON i.id_incidencia = ac.id_incidencia
    WHERE 1=1
  `

  const params = []
  let paramCount = 1

  if (filtros.fecha_desde) {
    query += ` AND i.fecha >= $${paramCount}`
    params.push(filtros.fecha_desde)
    paramCount++
  }

  if (filtros.fecha_hasta) {
    query += ` AND i.fecha <= $${paramCount}`
    params.push(filtros.fecha_hasta)
    paramCount++
  }

  if (filtros.gravedad) {
    query += ` AND i.gravedad = $${paramCount}`
    params.push(filtros.gravedad)
    paramCount++
  }

  if (filtros.estado) {
    query += ` AND i.estado = $${paramCount}`
    params.push(filtros.estado)
    paramCount++
  }

  if (filtros.id_tipo) {
    query += ` AND i.id_tipoIncidencia = $${paramCount}`
    params.push(filtros.id_tipo)
    paramCount++
  }

  if (filtros.id_grupo) {
    query += ` AND g.id_grupo = $${paramCount}`
    params.push(filtros.id_grupo)
    paramCount++
  }

  query += `
    GROUP BY i.id_incidencia, i.gravedad, i.observaciones, i.estado, 
             i.fecha, ti.nombre, ti.categoria, u.nombre, u.primerApellido
    ORDER BY i.fecha DESC
  `

  const result = await pool.query(query, params)
  return result.rows
}

export const obtenerEstadisticasPorPeriodo = async () => {
  const query = `
    SELECT 
      g.periodo,
      COUNT(DISTINCT i.id_incidencia) AS total_incidencias,
      COUNT(DISTINCT CASE WHEN i.gravedad = 'Grave' THEN i.id_incidencia END) AS graves,
      COUNT(DISTINCT CASE WHEN i.estado = 'Pendiente' THEN i.id_incidencia END) AS pendientes,
      COUNT(DISTINCT CASE WHEN i.estado = 'Resuelta' THEN i.id_incidencia END) AS resueltas,
      COUNT(DISTINCT ai.id_alumno) AS alumnos_involucrados
    FROM grupo g
    LEFT JOIN alumno a ON g.id_grupo = a.id_grupo
    LEFT JOIN alumno_incidencia ai ON a.id_alumno = ai.id_alumno
    LEFT JOIN incidencia i ON ai.id_incidencia = i.id_incidencia
    GROUP BY g.periodo
    ORDER BY g.periodo DESC
  `

  const result = await pool.query(query)
  return result.rows
}


export const obtenerRankingGrupos = async () => {
  const query = `
    SELECT 
      g.id_grupo,
      g.nombre AS grupo,
      g.grado,
      g.periodo,
      COUNT(DISTINCT ai.id_incidencia) AS total_incidencias,
      COUNT(DISTINCT CASE WHEN i.gravedad = 'Grave' THEN ai.id_incidencia END) AS graves,
      COUNT(DISTINCT ai.id_alumno) AS alumnos_con_incidencias,
      COUNT(DISTINCT a.id_alumno) AS total_alumnos
    FROM grupo g
    LEFT JOIN alumno a ON g.id_grupo = a.id_grupo
    LEFT JOIN alumno_incidencia ai ON a.id_alumno = ai.id_alumno
    LEFT JOIN incidencia i ON ai.id_incidencia = i.id_incidencia
    GROUP BY g.id_grupo, g.nombre, g.grado, g.periodo
    ORDER BY total_incidencias DESC
  `

  const result = await pool.query(query)
  return result.rows
}

export const aplicarAccionCorrectiva = async (id_incidencia, descripcion, fecha_aplicacion, id_usuario) => {
  const query = `
    INSERT INTO acc_correctiva (descripcion, fechaAplicacion, id_usuario, id_incidencia)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `

  const result = await pool.query(query, [descripcion, fecha_aplicacion, id_usuario, id_incidencia])
  return result.rows[0]
}