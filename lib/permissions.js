export const ROLES = {
  ADMIN: "Administrador",
  DOCENTE: "Docente",
  COORDINADOR: "Coordinador",
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

  // Registrar incidencias (docentes solo en sus grupos, coordinador y admin en todos)
  CREATE_INCIDENT: [ROLES.ADMIN, ROLES.DOCENTE, ROLES.COORDINADOR],

  // Ver incidencias (todos)
  VIEW_INCIDENTS: [ROLES.ADMIN, ROLES.DOCENTE, ROLES.COORDINADOR],

  // Ver solo incidencias de sus grupos (docentes)
  VIEW_OWN_INCIDENTS: [ROLES.DOCENTE],

  // Ver todas las incidencias (coordinador y admin)
  VIEW_ALL_INCIDENTS: [ROLES.ADMIN, ROLES.COORDINADOR],

  // Validar/Finalizar incidencias (coordinador y admin)
  VALIDATE_INCIDENT: [ROLES.ADMIN, ROLES.COORDINADOR],

  // Aplicar medidas correctivas (coordinador y admin)
  APPLY_CORRECTIVE_ACTION: [ROLES.ADMIN, ROLES.COORDINADOR],

  // Generar todos los reportes (coordinador y admin)
  GENERATE_ALL_REPORTS: [ROLES.ADMIN, ROLES.COORDINADOR],

  // Ver reportes de sus alumnos (docentes)
  VIEW_OWN_REPORTS: [ROLES.DOCENTE],

  // Exportar reportes (coordinador y admin)
  EXPORT_REPORTS: [ROLES.ADMIN, ROLES.COORDINADOR],
}

export function hasPermission(userRole, permission) {
  if (!PERMISSIONS[permission]) return false
  return PERMISSIONS[permission].includes(userRole)
}

export function getUserRole(user) {
  // Mapeo de id_rol del backend a nombres de roles
  const roleMap = {
    1: ROLES.ADMIN,
    2: ROLES.DOCENTE,
    3: ROLES.COORDINADOR,
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
