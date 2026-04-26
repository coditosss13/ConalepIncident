import api from './axios'

export const gruposApi = {
  getAll: async (params = {}) => {
    const response = await api.get('/grupos', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/grupos/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/grupos', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/grupos/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/grupos/${id}`)
    return response.data
  },

  getAllSimple: async () => {
    const response = await api.get('/grupos/simple')
    return response.data
  }
}

export default gruposApi