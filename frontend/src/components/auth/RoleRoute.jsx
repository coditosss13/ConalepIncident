import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Componente para restringir acceso por rol
 * @param {string[]} roles - Roles permitidos
 * @param {React.ReactNode} children - Contenido a renderizar
 */
function RoleRoute({ roles, children }) {
  const { user, hasRole } = useAuth()

  if (!user || !hasRole(roles)) {
    return <Navigate to="/" replace />
  }

  return children || <Outlet />
}

export default RoleRoute