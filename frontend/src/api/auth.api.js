import api from './axios'

export const authApi = {
  /**
   * Iniciar sesión
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @returns {Promise} Usuario y token
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },
  refresh: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken })
    return response.data
  },

  /**
   * Obtener usuario actual
   * @returns {Promise} Usuario
   */
  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  /**
   * Cambiar contraseña
   * @param {string} currentPassword - Contraseña actual
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise}
   */
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword
    })
    return response.data
  },

  /**
   * Cerrar sesión
   * @returns {Promise}
   */
  logout: async (refreshToken) => {
    const response = await api.post('/auth/logout', { refreshToken })
    return response.data
  }
}

export default authApi