export async function registrarActividad(token, accion, detalle, tipo = "INFO") {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bitacora`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        accion,
        detalle,
        tipo,
        fecha: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      console.error("Error al registrar actividad en bitácora")
    }
  } catch (error) {
    console.error("Error en bitácora:", error)
  }
}

export const ACCIONES_BITACORA = {
  LOGIN: "Inicio de sesión",
  LOGOUT: "Cierre de sesión",
  CREATE_INCIDENT: "Creación de incidencia",
  UPDATE_INCIDENT: "Actualización de incidencia",
  DELETE_INCIDENT: "Eliminación de incidencia",
  VALIDATE_INCIDENT: "Validación de incidencia",
  APPLY_CORRECTIVE: "Aplicación de acción correctiva",
  VIEW_REPORT: "Visualización de reporte",
  EXPORT_REPORT: "Exportación de reporte",
  MANAGE_USER: "Gestión de usuario",
  CHANGE_CONFIG: "Cambio de configuración",
}
