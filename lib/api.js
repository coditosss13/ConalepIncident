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
  const res = await fetch(`${API_URL}/api/incidencias`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error("Error al obtener incidencias")

  const data = await res.json()
  return data.data || []
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
  }
}

export function saveUserData(rol, nombre) {
  if (typeof window !== "undefined") {
    localStorage.setItem("userRol", rol.toString())
    localStorage.setItem("userName", nombre)
  }
}

export function getUserData() {
  if (typeof window !== "undefined") {
    return {
      rol: localStorage.getItem("userRol"),
      nombre: localStorage.getItem("userName"),
    }
  }
  return { rol: null, nombre: null }
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
