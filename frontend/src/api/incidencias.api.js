import axios from './axios'

const incidenciasApi = {
  getAll: async (params = {}) => {
    const response = await axios.get('/incidencias', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await axios.get(`/incidencias/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await axios.post('/incidencias', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await axios.put(`/incidencias/${id}`, data)
    return response.data
  },

  changeStatus: async (id, estado) => {
    const response = await axios.patch(`/incidencias/${id}/estado`, { estado })
    return response.data
  },

  addSeguimiento: async (id, data) => {
    const response = await axios.post(`/incidencias/${id}/seguimientos`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await axios.delete(`/incidencias/${id}`)
    return response.data
  },

  getStats: async () => {
    const response = await axios.get('/incidencias/stats')
    return response.data
  }
}

export default incidenciasApi
