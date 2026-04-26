import api from './axios'

export const usuariosApi = {
  /**
   * Obtener todos los usuarios con paginación
   */
  getAll: async (params = {}) => {
    const response = await api.get('/usuarios', { params })
    return response.data
  },

  /**
   * Obtener usuario por ID
   */
  getById: async (id) => {
    const response = await api.get(`/usuarios/${id}`)
    return response.data
  },

  /**
   * Crear nuevo usuario
   */
  create: async (data) => {
    const response = await api.post('/usuarios', data)
    return response.data
  },

  /**
   * Actualizar usuario
   */
  update: async (id, data) => {
    const response = await api.put(`/usuarios/${id}`, data)
    return response.data
  },

  /**
   * Eliminar usuario (soft delete)
   */
  delete: async (id) => {
    const response = await api.delete(`/usuarios/${id}`)
    return response.data
  },

  /**
   * Restaurar usuario desactivado
   */
  restore: async (id) => {
    const response = await api.patch(`/usuarios/${id}/restore`)
    return response.data
  },

  /**
   * Cambiar contraseña (Admin)
   */
  changePassword: async (id, newPassword) => {
    const response = await api.patch(`/usuarios/${id}/password`, { newPassword })
    return response.data
  },

  /**
   * Obtener roles disponibles
   */
  getRoles: async () => {
    const response = await api.get('/usuarios/roles')
    return response.data
  }
}

export default usuariosApi