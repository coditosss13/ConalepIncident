import { createContext, useContext, useState, useEffect } from 'react'
import authApi from '../api/auth.api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // Cargar usuario al iniciar
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await authApi.getMe()
          setUser(response.data)
        } catch (error) {
          console.error('Error al cargar usuario:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setToken(null)
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [token])

  /**
   * Iniciar sesión
   */
  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password)

      if (response.success) {
        const { usuario, token: newToken } = response.data

        localStorage.setItem('token', newToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)
        localStorage.setItem('user', JSON.stringify(usuario))

        setToken(newToken)
        setUser(usuario)

        return { success: true }
      }

      return { success: false, message: response.message }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al iniciar sesión'
      return { success: false, message }
    }
  }

  /**
   * Cerrar sesión
   */
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  const hasRole = (roles) => {
    if (!user || !user.rol) return false
    if (typeof roles === 'string') roles = [roles]
    return roles.includes(user.rol.nombre)
  }

  /**
   * Verificar permisos basados en jerarquía de roles
   * profesor < prefecto < administrador
   */
  const canAccess = (minRole) => {
    const roleHierarchy = {
      'profesor': 1,
      'prefecto': 2,
      'administrador': 3
    }

    if (!user || !user.rol) return false

    const userLevel = roleHierarchy[user.rol.nombre] || 0
    const minLevel = roleHierarchy[minRole] || 0

    return userLevel >= minLevel
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    hasRole,
    canAccess,
    isAuthenticated: !!token && !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

export default AuthContext