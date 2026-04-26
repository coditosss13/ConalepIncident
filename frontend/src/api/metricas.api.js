import axios from './axios'

const metricasApi = {
  getDashboard: async (params = {}) => {
    const response = await axios.get('/metricas/dashboard', { params })
    return response.data
  },

  getResumen: async (params = {}) => {
    const response = await axios.get('/metricas/resumen', { params })
    return response.data
  }
}

export default metricasApi
