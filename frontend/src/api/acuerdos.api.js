import axios from './axios'

const acuerdosApi = {
  generar: async (incidenciaId, alumnoId, payload = {}) => {
    const response = await axios.post('/acuerdos/generar', {
      incidencia_id: incidenciaId,
      alumno_id: alumnoId,
      ...payload
    })
    return response.data
  },

  generarDescarga: async (incidenciaId) => {
    const response = await axios.post('/acuerdos/generar-descarga', {
      incidencia_id: incidenciaId
    }, {
      responseType: 'blob'
    })
    return response
  },

  descargar: async (id) => {
    const response = await axios.get(`/acuerdos/${id}/descargar`, {
      responseType: 'blob'
    })
    return response
  },

  getByIncidencia: async (incidenciaId) => {
    const response = await axios.get(`/acuerdos/incidencia/${incidenciaId}`)
    return response.data
  },

  firmar: async (id, archivoFirmado = null, seguimientoSesion = '') => {
    if (!archivoFirmado) {
      const response = await axios.patch(`/acuerdos/${id}/firmar`, { seguimiento_sesion: seguimientoSesion })
      return response.data
    }

    const formData = new FormData()
    formData.append('archivo_firmado', archivoFirmado)
    if (seguimientoSesion) {
      formData.append('seguimiento_sesion', seguimientoSesion)
    }
    const response = await axios.patch(`/acuerdos/${id}/firmar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  delete: async (id) => {
    const response = await axios.delete(`/acuerdos/${id}`)
    return response.data
  }
}

export default acuerdosApi
