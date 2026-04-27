import axios from './axios'

const archivosApi = {
  upload: async (incidenciaId, files, alumnoId = null, seguimientoId = null) => {
    const formData = new FormData()
    formData.append('incidencia_id', incidenciaId)
    if (alumnoId) formData.append('alumno_id', alumnoId)
    if (seguimientoId) formData.append('seguimiento_id', seguimientoId)
    files.forEach(file => formData.append('files', file))

    const response = await axios.post('/archivos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  getByIncidencia: async (incidenciaId) => {
    const response = await axios.get(`/archivos/incidencia/${incidenciaId}`)
    return response.data
  },

  descargar: async (id) => {
    const response = await axios.get(`/archivos/${id}/descargar`, {
      responseType: 'blob'
    })
    return response
  },

  delete: async (id) => {
    const response = await axios.delete(`/archivos/${id}`)
    return response.data
  }
}

export default archivosApi
