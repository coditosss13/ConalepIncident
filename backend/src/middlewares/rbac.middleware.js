/**
 * Middleware para control de acceso basado en roles (RBAC)
 *
 * Jerarquía de roles:
 * - profesor: nivel 1
 * - prefecto: nivel 2
 * - admin: nivel 3
 */

const ROLES_JERARQUIA = {
  'profesor': 1,
  'prefecto': 2,
  'administrador': 3
};

/**
 * Verifica si el usuario tiene el rol mínimo requerido
 * @param {string} minRole - Rol mínimo requerido ('profesor', 'prefecto', 'administrador')
 */
const rbacMiddleware = (minRole) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const userRole = req.usuario.rol?.nombre;

    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: 'Usuario sin rol asignado'
      });
    }

    const minLevel = ROLES_JERARQUIA[minRole];
    const userLevel = ROLES_JERARQUIA[userRole];

    if (userLevel === undefined) {
      return res.status(403).json({
        success: false,
        message: 'Rol de usuario inválido'
      });
    }

    if (userLevel < minLevel) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción'
      });
    }

    next();
  };
};

/**
 * Verifica si el usuario tiene exactamente uno de los roles especificados
 * @param {string[]} roles - Array de roles permitidos
 */
const hasRole = (roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const userRole = req.usuario.rol?.nombre;

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción'
      });
    }

    next();
  };
};

/**
 * Verifica si el usuario es propietario del recurso o tiene rol de admin
 * @param {string} userIdField - Campo donde buscar el ID del usuario propietario
 */
const isOwnerOrAdmin = (userIdField = 'id') => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const userRole = req.usuario.rol?.nombre;
    const userId = req.usuario.id;

    // Admin tiene acceso completo
    if (userRole === 'administrador') {
      return next();
    }

    // Verificar si es propietario
    let resourceUserId;
    if (userIdField === 'id') {
      resourceUserId = parseInt(req.params.id);
    } else {
      resourceUserId = parseInt(req.body[userIdField] || req.params[userIdField]);
    }

    if (userId !== resourceUserId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso'
      });
    }

    next();
  };
};

module.exports = {
  rbacMiddleware,
  checkPermissions: hasRole,
  hasRole,
  isOwnerOrAdmin,
  ROLES_JERARQUIA
};