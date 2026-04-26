import api from './axios'

export const alumnosApi = {
  getAll: async (params = {}) => {
    const response = await api.get('/alumnos', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/alumnos/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/alumnos', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/alumnos/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/alumnos/${id}`)
    return response.data
  },

  restore: async (id) => {
    const response = await api.patch(`/alumnos/${id}/restore`)
    return response.data
  },

  getByGrupo: async (grupoId) => {
    const response = await api.get(`/alumnos/grupo/${grupoId}`)
    return response.data
  },

  search: async (query) => {
    const response = await api.get('/alumnos/search', { params: { q: query } })
    return response.data
  }
}

export default alumnosApi