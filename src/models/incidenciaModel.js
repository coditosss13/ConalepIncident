import pool from "../config/db.js";

// ----------------------------------------------
// 1. Registrar incidencia COMPLETA (ya la tenías)
// ----------------------------------------------
export const registrarIncidenciaCompleta = async (incidenciaData, alumnos, evidencias) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Insertar incidencia
        const incidenciaQuery = `
            INSERT INTO incidencia (gravedad, observaciones, estado, fecha, id_usuario, id_tipoincidencia)
            VALUES ($1, $2, $3, NOW(), $4, $5)
            RETURNING id_incidencia;
        `;

        const incidenciaResult = await client.query(incidenciaQuery, [
            incidenciaData.gravedad,
            incidenciaData.observaciones,
            incidenciaData.estado,
            incidenciaData.id_usuario,
            incidenciaData.id_tipoincidencia
        ]);

        const idIncidencia = incidenciaResult.rows[0].id_incidencia;

        // Insertar alumnos involucrados
        for (const alumno of alumnos) {
            await client.query(`
                INSERT INTO alumno_incidencia (id_incidencia, id_alumno, observacion)
                VALUES ($1, $2, $3)
            `, [
                idIncidencia,
                alumno.id_alumno,
                alumno.observacion || null
            ]);
        }

        // Insertar evidencias
        for (const file of evidencias) {
            await client.query(`
                INSERT INTO evidencia (archivo, tipoarchivo, fechasubida, id_incidencia)
                VALUES ($1, $2, NOW(), $3)
            `, [
                file.filename,
                file.mimetype,
                idIncidencia
            ]);
        }

        await client.query("COMMIT");

        return { ok: true, id_incidencia: idIncidencia };

    } catch (err) {
        await client.query("ROLLBACK");
        console.error("❌ Error en registro de incidencia completa:", err);
        throw err;

    } finally {
        client.release();
    }
};



// ----------------------------------------------
// 2. OBTENER TODAS LAS INCIDENCIAS
// ----------------------------------------------
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
        INNER JOIN tipo_incidencia t ON t.id_tipoincidencia = i.id_tipoincidencia
        ORDER BY i.id_incidencia DESC;
    `;

    const result = await pool.query(query);
    return result.rows;
};




// ----------------------------------------------
// 3. OBTENER DETALLES DE UNA INCIDENCIA POR ID
// ----------------------------------------------
export const obtenerIncidenciaPorId = async (id) => {
    // 1. Datos generales de la incidencia
    const incidenciaQuery = `
    SELECT 
        i.*,
        u.nombre AS usuario,
        t.nombre AS tipo_incidencia
    FROM incidencia i
    INNER JOIN usuario u ON u.id_usuario = i.id_usuario
    INNER JOIN tipo_incidencia t ON t.id_tipoincidencia = i.id_tipoincidencia
    WHERE i.id_incidencia = $1;
    `;


    const incidenciaResult = await pool.query(incidenciaQuery, [id]);

    if (incidenciaResult.rowCount === 0) return null;

    // 2. Alumnos involucrados
    const alumnosQuery = `
        SELECT a.id_alumno, a.nombre, ai.observacion
        FROM alumno_incidencia ai
        INNER JOIN alumno a ON a.id_alumno = ai.id_alumno
        WHERE ai.id_incidencia = $1;
    `;
    const alumnosResult = await pool.query(alumnosQuery, [id]);

    // 3. Evidencias
    const evidenciaQuery = `
        SELECT id_evidencia, archivo, tipoarchivo, fechasubida
        FROM evidencia
        WHERE id_incidencia = $1;
    `;
    const evidenciaResult = await pool.query(evidenciaQuery, [id]);

    return {
        ...incidenciaResult.rows[0],
        alumnos: alumnosResult.rows,
        evidencias: evidenciaResult.rows
    };
};
