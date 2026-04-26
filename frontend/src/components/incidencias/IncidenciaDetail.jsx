import { useEffect, useState } from 'react'
import { Upload, Download, FileText } from 'lucide-react'
import Button from '../common/Button'
import archivosApi from '../../api/archivos.api'
import acuerdosApi from '../../api/acuerdos.api'
import incidenciasApi from '../../api/incidencias.api'
import Alert from '../common/Alert'

function IncidenciaDetail({ incidencia, onClose, userRole }) {
  const [seguimiento, setSeguimiento] = useState('')
  const [alumnoSeguimiento, setAlumnoSeguimiento] = useState('')
  const [archivoInput, setArchivoInput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [archivos, setArchivos] = useState(incidencia?.archivos || [])
  const [acuerdos, setAcuerdos] = useState([])
  const [seguimientoLoading, setSeguimientoLoading] = useState(false)
  const [alert, setAlert] = useState({ type: '', message: '' })
  const isClosed = incidencia?.estado === 'cerrada'

  useEffect(() => {
    const loadAcuerdos = async () => {
      try {
        const response = await acuerdosApi.getByIncidencia(incidencia.id)
        setAcuerdos(response.data || [])
      } catch (error) {
        setAcuerdos([])
      }
    }
    loadAcuerdos()
  }, [incidencia.id])

  if (!incidencia) return null

  const estadoColors = {
    abierta: 'bg-red-100 text-red-800',
    en_proceso: 'bg-yellow-100 text-yellow-800',
    cerrada: 'bg-green-100 text-green-800'
  }

  const handleSubirArchivos = async () => {
    if (isClosed) {
      setAlert({ type: 'warning', message: 'Incidencia cerrada: no se pueden subir archivos' })
      return
    }
    if (!archivoInput) return

    setLoading(true)
    try {
      const res = await archivosApi.upload(incidencia.id, Array.from(archivoInput))
      setArchivos([...archivos, ...(res.data || [])])
      setArchivoInput(null)
      setAlert({ type: 'success', message: 'Archivos subidos correctamente' })
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al subir archivos: ' + (err.response?.data?.message || err.message) })
    } finally {
      setLoading(false)
    }
  }

  const handleAddSeguimiento = async () => {
    if (isClosed) {
      setAlert({ type: 'warning', message: 'Incidencia cerrada: no se pueden agregar seguimientos' })
      return
    }
    if (!seguimiento.trim()) return

    setSeguimientoLoading(true)
    try {
      await incidenciasApi.addSeguimiento(incidencia.id, {
        descripcion: seguimiento,
        alumno_id: alumnoSeguimiento ? Number(alumnoSeguimiento) : undefined
      })
      setSeguimiento('')
      setAlumnoSeguimiento('')
      setAlert({ type: 'success', message: 'Seguimiento agregado correctamente' })
      // Recargar la incidencia para ver el nuevo seguimiento
      const res = await incidenciasApi.getById(incidencia.id)
      onClose()
      // Pequeño delay para permitir que el modal se cierre
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al agregar seguimiento: ' + (err.response?.data?.message || err.message) })
    } finally {
      setSeguimientoLoading(false)
    }
  }

  const handleGenerarAcuerdo = async (alumnoId) => {
    if (isClosed) {
      setAlert({ type: 'warning', message: 'Incidencia cerrada: no se pueden generar acuerdos' })
      return
    }
    setLoading(true)
    try {
      const res = await acuerdosApi.generar(incidencia.id, alumnoId)
      setAcuerdos([...acuerdos, res.data.acuerdo])
      const blobResponse = await acuerdosApi.descargar(res.data.acuerdo.id)
      const blobUrl = window.URL.createObjectURL(new Blob([blobResponse.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `acuerdo_${res.data.acuerdo.id}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      alert('Error al generar acuerdo: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleDescargarArchivo = (archivoId, nombre) => {
    archivosApi.descargar(archivoId).then((response) => {
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = nombre
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(blobUrl)
    })
  }

  const handleAbrirArchivo = (archivoId) => {
    archivosApi.descargar(archivoId).then((response) => {
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]))
      window.open(blobUrl, '_blank', 'noopener,noreferrer')
    })
  }

  const handleDescargarAcuerdo = async (acuerdoId, abrir = false) => {
    try {
      const response = await acuerdosApi.descargar(acuerdoId)
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      if (abrir) {
        window.open(blobUrl, '_blank', 'noopener,noreferrer')
      } else {
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = `acuerdo_${acuerdoId}.pdf`
        document.body.appendChild(link)
        link.click()
        link.remove()
      }
      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      setAlert({ type: 'error', message: 'No se pudo descargar el acuerdo' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Incidencia #{incidencia.id}
          </h2>
          <p className="text-gray-600">{incidencia.titulo}</p>
        </div>
      </div>

      {/* Estado */}
      <div className="flex items-center gap-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          estadoColors[incidencia.estado]
        }`}>
          {incidencia.estado === 'en_proceso' ? 'En proceso' : incidencia.estado}
        </span>
        <span className="text-sm text-gray-500">
          {new Date(incidencia.fecha).toLocaleDateString('es-MX')}
        </span>
      </div>

      {/* Información principal */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Información</h3>
          <dl className="space-y-1 text-sm">
            <div>
              <dt className="text-gray-500">Severidad</dt>
              <dd className="font-medium">{incidencia.severidad?.nombre}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Grupo</dt>
              <dd className="font-medium">{incidencia.grupo?.nombre}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Profesor</dt>
              <dd className="font-medium">{incidencia.profesor?.nombre}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Alumnos involucrados</h3>
          <ul className="space-y-1 text-sm">
            {incidencia.alumnos?.map(alumno => (
              <li key={alumno.id} className="flex justify-between items-center">
                <span>{alumno.nombre}</span>
                <span className="text-gray-500 text-xs">
                  {alumno.IncidenciaAlumnos?.grupo_snapshot || alumno.grupo?.nombre}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Descripción</h3>
        <p className="text-gray-600 whitespace-pre-wrap">{incidencia.descripcion}</p>
      </div>

      {/* Alerts */}
      {alert.message && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
      )}

      {/* Seguimientos */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Seguimientos</h3>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {incidencia.seguimientos?.length > 0 ? (
            incidencia.seguimientos.map((seg, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {seg.usuario?.nombre}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(seg.fecha).toLocaleString('es-MX')}
                  </span>
                </div>
                {seg.alumno && (
                  <span className="text-xs text-primary">
                    Alumno: {seg.alumno.nombre}
                  </span>
                )}
                <p className="text-sm text-gray-600 mt-1">{seg.descripcion}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No hay seguimientos registrados</p>
          )}
        </div>

        {/* Agregar seguimiento */}
        {(userRole === 'administrador' || userRole === 'prefecto') && !isClosed && (
          <div className="mt-3">
            <select
              className="input mb-2"
              value={alumnoSeguimiento}
              onChange={(e) => setAlumnoSeguimiento(e.target.value)}
            >
              <option value="">Seguimiento general de la incidencia</option>
              {incidencia.alumnos?.map((alumno) => (
                <option key={alumno.id} value={alumno.id}>
                  {alumno.nombre} ({alumno.matricula})
                </option>
              ))}
            </select>
            <textarea
              className="input min-h-[80px]"
              placeholder="Agregar seguimiento..."
              value={seguimiento}
              onChange={(e) => setSeguimiento(e.target.value)}
            />
            <Button
              className="mt-2"
              onClick={handleAddSeguimiento}
              disabled={!seguimiento.trim() || seguimientoLoading}
              loading={seguimientoLoading}
            >
              {seguimientoLoading ? 'Agregando...' : 'Agregar seguimiento'}
            </Button>
          </div>
        )}
      </div>

      {/* Archivos adjuntos */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Archivos adjuntos</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {archivos.map(archivo => (
            <div
              key={archivo.id}
              className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
            >
              <span className="text-sm">{archivo.nombre_original || archivo.nombre_archivo}</span>
              <button
                onClick={() => handleDescargarArchivo(archivo.id, archivo.nombre_original)}
                className="text-primary hover:text-primary-dark"
                title="Descargar archivo"
              >
                <Download size={16} />
              </button>
              <button
                onClick={() => handleAbrirArchivo(archivo.id)}
                className="text-primary hover:text-primary-dark text-xs underline"
                title="Abrir en nueva pestaña"
              >
                Abrir
              </button>
            </div>
          ))}
        </div>

        {!isClosed && (
        <div className="flex items-center gap-2">
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={(e) => setArchivoInput(e.target.files)}
            className="text-sm"
          />
          <Button
            variant="secondary"
            onClick={handleSubirArchivos}
            disabled={!archivoInput || loading}
          >
            <Upload size={16} />
            {loading ? 'Subiendo...' : 'Subir'}
          </Button>
        </div>
        )}
      </div>

      {/* Acuerdos */}
      {(userRole === 'administrador' || userRole === 'prefecto') && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Acuerdos</h3>
          <div className="space-y-2">
            {incidencia.alumnos?.map(alumno => (
              <div
                key={alumno.id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
              >
                <div className="text-sm">
                  <div>{alumno.nombre}</div>
                  <div className="text-xs text-gray-500">
                    {(acuerdos.find((item) => item.alumno_id === alumno.id)?.firmado) ? 'Firmado' : 'Pendiente'}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!isClosed && (
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleGenerarAcuerdo(alumno.id)}
                      disabled={loading}
                    >
                      <FileText size={16} className="mr-1" />
                      {loading ? 'Generando...' : 'Generar acuerdo'}
                    </Button>
                  )}
                  {acuerdos.find((item) => item.alumno_id === alumno.id) && (
                    <>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleDescargarAcuerdo(acuerdos.find((item) => item.alumno_id === alumno.id).id, true)}
                      >
                        Abrir PDF
                      </Button>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleDescargarAcuerdo(acuerdos.find((item) => item.alumno_id === alumno.id).id, false)}
                      >
                        Descargar PDF
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default IncidenciaDetail
