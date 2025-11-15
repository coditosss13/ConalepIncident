import { 
    registrarIncidenciaCompleta, 
    obtenerIncidencia as obtenerIncidenciaDB, 
    obtenerIncidenciaPorId as obtenerIncidenciaPorIdDB 
} from "../models/incidenciaModel.js";

export const registrarIncidencia = async (req, res) => {
    try {
        let incidenciaData;
        let alumnos = [];
        let evidencias = [];

        if (req.headers['content-type']?.includes("multipart/form-data")) {
            incidenciaData = JSON.parse(req.body.data); 
            alumnos = JSON.parse(req.body.alumnos || "[]");
            evidencias = req.files || [];
        } else {
            incidenciaData = req.body;
            alumnos = req.body.alumnos || [];
            evidencias = [];
        }

        const resultado = await registrarIncidenciaCompleta(
            incidenciaData,
            alumnos,
            evidencias
        );

        res.status(200).json({
            ok: true,
            mensaje: "Incidencia registrada correctamente",
            data: resultado
        });

    } catch (err) {
        console.error("❌ Error en controlador registrarIncidencia:", err);
        res.status(500).json({ ok: false, error: err.message });
    }
};

// Obtener todas las incidencias
export const obtenerIncidencias = async (req, res) => {
    try {
        const data = await obtenerIncidenciaDB(); 
        res.json({ ok: true, data });
    } catch (err) {
        console.error("❌ Error al obtener incidencias:", err);
        res.status(500).json({ ok: false, error: err.message });
    }
};

// Obtener una incidencia por ID
export const obtenerIncidenciaPorId = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await obtenerIncidenciaPorIdDB(id);

        if (!data) {
            return res.status(404).json({
                ok: false,
                mensaje: "Incidencia no encontrada"
            });
        }

        res.json({ ok: true, data });

    } catch (err) {
        console.error("❌ Error al obtener incidencia por ID:", err);
        res.status(500).json({ ok: false, error: err.message });
    }
};
