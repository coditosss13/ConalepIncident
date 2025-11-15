// src/models/userModel.js
import pool from "../config/db.js";

export const findUserByUsername = async (usuario) => {
  try {
    console.log("🟦 Entrando a findUserByUsername con usuario:", usuario);

    if (!usuario) {
      throw new Error("El nombre de usuario está vacío o indefinido");
    }

    const query = "SELECT * FROM usuario WHERE usuario = $1";
    console.log("🟨 Ejecutando query:", query, "con valores:", [usuario]);

    const result = await pool.query(query, [usuario]);
    console.log("🟩 Resultado de la búsqueda:", result.rows);

    return result.rows[0];
  } catch (error) {
    console.error("❌ Error en findUserByUsername:", error.message);
    throw error;
  }
};


// 📌 NUEVA FUNCIÓN: crear usuario
export const registerDocenteCompleto = async (data) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    console.log("📘 Datos recibidos en el modelo:", data);

    // 1️⃣ INSERTAR EN DOCENTE
    const docenteQuery = `
      INSERT INTO docente (clave, correo, area)
      VALUES ($1, $2, $3)
      RETURNING id_docente, clave, correo, area
    `;

    const docenteValues = [
      data.clave,
      data.correo,
      data.area
    ];

    const docenteRes = await client.query(docenteQuery, docenteValues);
    const docente = docenteRes.rows[0];

    console.log("🟩 Docente creado:", docente);

    // 2️⃣ INSERTAR EN USUARIO
    const usuarioQuery = `
      INSERT INTO usuario (
        nombre,
        primerapellido,
        segundoapellido,
        usuario,
        password,
        id_rol,
        id_docente
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id_usuario, nombre, primerapellido, segundoapellido, usuario, id_rol, id_docente
    `;

    const usuarioValues = [
      data.nombre,
      data.primerapellido,
      data.segundoapellido,
      data.usuario,
      data.password,
      data.id_rol,
      docente.id_docente
    ];

    const usuarioRes = await client.query(usuarioQuery, usuarioValues);
    const usuario = usuarioRes.rows[0];

    console.log("🟩 Usuario creado:", usuario);

    await client.query("COMMIT");

    return { docente, usuario };

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error en registro completo:", error);
    throw error;
  } finally {
    client.release();
  }
};

export const obtenerTodasLasIncidencias = async () => {
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
        JOIN usuario u ON u.id_usuario = i.id_usuario
        JOIN tipoincidencia t ON t.id_tipoincidencia = i.id_tipoincidencia
        ORDER BY i.fecha DESC;
    `;

    const result = await pool.query(query);
    return result.rows;
};

export const obtenerIncidenciaDetallada = async (id) => {
    // 1. Datos principales
    const incidenciaQuery = `
        SELECT 
            i.id_incidencia,
            i.gravedad,
            i.observaciones,
            i.estado,
            i.fecha,
            u.nombre AS usuario,
            t.nombre AS tipo_incidencia
        FROM incidencia i
        JOIN usuario u ON u.id_usuario = i.id_usuario
        JOIN tipoincidencia t ON t.id_tipoincidencia = i.id_tipoincidencia
        WHERE i.id_incidencia = $1
        LIMIT 1;
    `;
    const resInc = await pool.query(incidenciaQuery, [id]);

    if (resInc.rows.length === 0) return null;

    const incidencia = resInc.rows[0];

    // 2. Alumnos involucrados
    const alumnosQuery = `
        SELECT 
            a.id_alumno,
            a.nombre,
            ai.observacion
        FROM alumno_incidencia ai
        JOIN alumno a ON a.id_alumno = ai.id_alumno
        WHERE ai.id_incidencia = $1;
    `;
    const alumnos = (await pool.query(alumnosQuery, [id])).rows;

    // 3. Evidencias
    const evidenciaQuery = `
        SELECT 
            id_evidencia,
            archivo,
            tipoarchivo,
            fechasubida
        FROM evidencia
        WHERE id_incidencia = $1;
    `;
    const evidencias = (await pool.query(evidenciaQuery, [id])).rows;

    return {
        ...incidencia,
        alumnos,
        evidencias
    };
};