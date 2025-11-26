export const ROLES = {
  ADMIN: "Administrador",
  DOCENTE: "Docente",
  PREFECTO: "Prefecto",
}

export const PERMISSIONS = {
  // Gestión de usuarios (solo administrador)
  MANAGE_USERS: [ROLES.ADMIN],

  // Configuración de catálogos (solo administrador)
  MANAGE_CATALOGS: [ROLES.ADMIN],

  // Configuraciones generales (solo administrador)
  MANAGE_CONFIG: [ROLES.ADMIN],

  // Ver bitácora (solo administrador)
  VIEW_BITACORA: [ROLES.ADMIN],

  // Registrar incidencias (docentes solo en sus grupos, prefecto y admin en todos)
  CREATE_INCIDENT: [ROLES.ADMIN, ROLES.DOCENTE, ROLES.PREFECTO],

  // Ver incidencias (todos)
  VIEW_INCIDENTS: [ROLES.ADMIN, ROLES.DOCENTE, ROLES.PREFECTO],

  // Ver solo incidencias de sus grupos (docentes)
  VIEW_OWN_INCIDENTS: [ROLES.DOCENTE],

  // Ver todas las incidencias (prefecto y admin)
  VIEW_ALL_INCIDENTS: [ROLES.ADMIN, ROLES.PREFECTO],

  // Validar/Finalizar incidencias (prefecto y admin)
  VALIDATE_INCIDENT: [ROLES.ADMIN, ROLES.PREFECTO],

  // Aplicar medidas correctivas (prefecto y admin)
  APPLY_CORRECTIVE_ACTION: [ROLES.ADMIN, ROLES.PREFECTO],

  // Generar todos los reportes (prefecto y admin)
  GENERATE_ALL_REPORTS: [ROLES.ADMIN, ROLES.PREFECTO],

  // Ver reportes de sus alumnos (docentes)
  VIEW_OWN_REPORTS: [ROLES.DOCENTE],

  // Exportar reportes (prefecto y admin)
  EXPORT_REPORTS: [ROLES.ADMIN, ROLES.PREFECTO],
}

export function hasPermission(userRole, permission) {
  if (!PERMISSIONS[permission]) return false
  return PERMISSIONS[permission].includes(userRole)
}

export function getUserRole(user) {
  console.log("[v0] Usuario desde localStorage:", user)

  // Mapeo de id_rol del backend a nombres de roles
  const roleMap = {
    1: ROLES.ADMIN,
    2: ROLES.DOCENTE,
    3: ROLES.PREFECTO,
  }

  // También mapear por nombre de rol directamente si viene del backend
  if (user?.rol) {
    if (user.rol === "Administrador" || user.rol === ROLES.ADMIN) return ROLES.ADMIN
    if (user.rol === "Docente" || user.rol === ROLES.DOCENTE) return ROLES.DOCENTE
    if (user.rol === "Prefecto" || user.rol === ROLES.PREFECTO) return ROLES.PREFECTO
  }

  return roleMap[user?.id_rol] || ROLES.DOCENTE
}

export function canManageUsers(userRole) {
  return hasPermission(userRole, "MANAGE_USERS")
}

export function canViewAllIncidents(userRole) {
  return hasPermission(userRole, "VIEW_ALL_INCIDENTS")
}

export function canValidateIncidents(userRole) {
  return hasPermission(userRole, "VALIDATE_INCIDENT")
}

export function canExportReports(userRole) {
  return hasPermission(userRole, "EXPORT_REPORTS")
}
