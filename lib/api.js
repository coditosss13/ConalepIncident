const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

// Auth API
export async function login(usuario, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password }),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Error en login")
  }

  return res.json()
}

export async function registerDocente(data) {
  const res = await fetch(`${API_URL}/api/auth/register-docente`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error en registro")
  }

  return res.json()
}

// Incidencias API
export async function getIncidencias(token) {
  console.log("[v0] Obteniendo incidencias con token:", token ? "Token presente" : "Sin token")

  const res = await fetch(`${API_URL}/api/incidencias/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  console.log("[v0] Respuesta status:", res.status)

  if (!res.ok) {
    const errorText = await res.text()
    console.error("[v0] Error al obtener incidencias:", errorText)
    throw new Error("Error al obtener incidencias")
  }

  const response = await res.json()
  console.log("[v0] Datos recibidos:", response)

  return response.data || response || []
}

export async function getIncidenciaById(id, token) {
  const res = await fetch(`${API_URL}/api/incidencias/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error("Error al obtener incidencia")

  const data = await res.json()
  return data.data
}

export async function createIncidencia(formData, token) {
  const res = await fetch(`${API_URL}/api/incidencias`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al crear incidencia")
  }

  return res.json()
}

export async function getAlumnos(token) {
  const res = await fetch(`${API_URL}/api/incidencias/alumnos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al obtener alumnos")
  }

  const data = await res.json()
  return data.data || []
}

export async function getTiposIncidencia(token) {
  const res = await fetch(`${API_URL}/api/incidencias/tipos-incidencia`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al obtener tipos de incidencia")
  }

  const data = await res.json()
  return data.data || []
}

export async function getEstadisticasAdmin(token) {
  const res = await fetch(`${API_URL}/api/incidencias/stats/admin`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al obtener estadísticas")
  }

  const data = await res.json()
  return data.stats || data.data || {}
}

export async function getEstadisticasPrefecto(token) {
  const res = await fetch(`${API_URL}/api/incidencias/stats/prefecto`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al obtener estadísticas")
  }

  const data = await res.json()
  return data.stats || data.data || {}
}

export async function getEstadisticasDocente(id_usuario, token) {
  const res = await fetch(`${API_URL}/api/incidencias/stats/docente/${id_usuario}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al obtener estadísticas")
  }

  const data = await res.json()
  return data.stats || data.data || {}
}

export async function getIncidenciasPendientes(token) {
  const res = await fetch(`${API_URL}/api/incidencias/pendientes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al obtener incidencias pendientes")
  }

  const data = await res.json()
  return data.data || []
}

export async function validarIncidencia(id_incidencia, aprobada, observaciones, id_usuario, token) {
  const res = await fetch(`${API_URL}/api/incidencias/${id_incidencia}/validar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ aprobada, observaciones, id_usuario }),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al validar incidencia")
  }

  return res.json()
}

export async function aplicarAccionCorrectiva(id_incidencia, descripcion, fecha_aplicacion, id_usuario, token) {
  const res = await fetch(`${API_URL}/api/incidencias/${id_incidencia}/accion-correctiva`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ descripcion, fecha_aplicacion, id_usuario }),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al aplicar acción correctiva")
  }

  return res.json()
}

// Helper para guardar token
export function saveToken(token) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token)
  }
}

export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
    localStorage.removeItem("userRol")
    localStorage.removeItem("userName")
    localStorage.removeItem("user")
  }
}

// Función para verificar permisos según rol
export function hasPermission(requiredRole) {
  if (typeof window !== "undefined") {
    const userRole = localStorage.getItem("userRol")
    // Administrador General (rol 1) tiene todos los permisos
    if (userRole === "1") return true
    // Docente (rol 2) puede registrar incidencias
    if (userRole === "2" && requiredRole === "registro") return true
    // Prefectura/Control Escolar (rol 3) puede validar y generar reportes
    if (userRole === "3" && (requiredRole === "validacion" || requiredRole === "reportes")) return true
    return false
  }
  return false
}

// Helper para guardar y obtener datos de usuario
export function saveUserData(userData) {
  if (typeof window !== "undefined") {
    // Guardar el objeto completo del usuario
    localStorage.setItem("user", JSON.stringify(userData))
    // Mantener compatibilidad con código existente
    localStorage.setItem("userRol", userData.id_rol?.toString() || userData.rol?.toString())
    localStorage.setItem("userName", userData.nombre)
  }
}

export function getUserData() {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      return JSON.parse(userStr)
    }
    // Fallback para compatibilidad
    return {
      rol: localStorage.getItem("userRol"),
      nombre: localStorage.getItem("userName"),
    }
  }
  return { rol: null, nombre: null }
}

export async function getGruposDocente(id_docente, token) {
  const res = await fetch(`${API_URL}/api/incidencias/grupos-docente/${id_docente}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al obtener grupos del docente")
  }

  const data = await res.json()
  return data.data || []
}

export async function getAlumnosPorGrupo(id_grupo, token) {
  const res = await fetch(`${API_URL}/api/incidencias/alumnos-grupo/${id_grupo}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al obtener alumnos del grupo")
  }

  const data = await res.json()
  return data.data || []
}

export async function getAccionesCorrectivas(token) {
  const res = await fetch(`${API_URL}/api/incidencias/acciones-correctivas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al obtener acciones correctivas")
  }

  const data = await res.json()
  return data.data || []
}
