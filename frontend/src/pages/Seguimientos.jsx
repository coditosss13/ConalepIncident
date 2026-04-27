import { useEffect, useMemo, useState } from 'react'
import incidenciasApi from '../api/incidencias.api'
import acuerdosApi from '../api/acuerdos.api'
import archivosApi from '../api/archivos.api'
import gruposApi from '../api/grupos.api'
import Alert from '../components/common/Alert'
import Button from '../components/common/Button'

function Seguimientos() {
  const [incidencias, setIncidencias] = useState([])
  const [incidenciaActiva, setIncidenciaActiva] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [archivosIncidencia, setArchivosIncidencia] = useState([])
  const [verCerradas, setVerCerradas] = useState(false)
  const [archivoSeguimiento, setArchivoSeguimiento] = useState(null)
  const [grupos, setGrupos] = useState([])
  const [filtroGrupoId, setFiltroGrupoId] = useState('')
  const [filtroSemestre, setFiltroSemestre] = useState('')
  const [filtroTexto, setFiltroTexto] = useState('')
  const incidenciaCerrada = incidenciaActiva?.estado === 'cerrada'

  const cargarIncidencias = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await incidenciasApi.getAll({
        page: 1,
        limit: 50,
        estado: verCerradas ? 'cerrada' : undefined,
        grupo_id: filtroGrupoId || undefined,
        semestre: filtroSemestre || undefined
      })
      setIncidencias(response.data || [])
      if (!incidenciaActiva && response.data?.length) {
        await seleccionarIncidencia(response.data[0].id)
      }
    } catch (err) {
      setError('No se pudieron cargar las incidencias para seguimiento')
    } finally {
      setLoading(false)
    }
  }

  const seleccionarIncidencia = async (id) => {
    setLoading(true)
    try {
      const detail = await incidenciasApi.getById(id)
      setIncidenciaActiva(detail.data)
      const archivosRes = await archivosApi.getByIncidencia(id)
      setArchivosIncidencia(archivosRes.data || [])
      setArchivoSeguimiento(null)
    } catch (err) {
      setError('No se pudo cargar el detalle de la incidencia')
    } finally {
      setLoading(false)
    }
  }

  const cambiarEstado = async (estado) => {
    if (!incidenciaActiva) return
    if (incidenciaCerrada) {
      setError('La incidencia está cerrada y no admite cambios')
      return
    }
    if (incidenciaActiva.estado === estado) {
      setError(`La incidencia ya está en estado ${estado}`)
      return
    }
    try {
      await incidenciasApi.changeStatus(incidenciaActiva.id, estado)
      setSuccess(`Incidencia actualizada a ${estado}`)
      await seleccionarIncidencia(incidenciaActiva.id)
      await cargarIncidencias()
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo actualizar estado')
    }
  }

  const abrirODescargarArchivo = async (archivo, abrir = false) => {
    try {
      const response = await archivosApi.descargar(archivo.id)
      const contentType =
        response?.headers?.['content-type'] ||
        (archivo.tipo === 'pdf' ? 'application/pdf' : undefined) ||
        'application/octet-stream'
      const blob = new Blob([response.data], { type: contentType })
      const blobUrl = window.URL.createObjectURL(blob)

      if (abrir) {
        window.open(blobUrl, '_blank', 'noopener,noreferrer')
      } else {
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = archivo.nombre_original || archivo.nombre_archivo
        document.body.appendChild(link)
        link.click()
        link.remove()
      }

      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000)
    } catch (err) {
      setError('No se pudo abrir o descargar el archivo')
    }
  }

  const subirArchivoSeguimiento = async () => {
    if (incidenciaCerrada) {
      setError('La incidencia está cerrada y no admite cambios')
      return
    }
    if (!archivoSeguimiento) {
      setError('Selecciona un archivo PDF o imagen para subir')
      return
    }

    try {
      await archivosApi.upload(incidenciaActiva.id, [archivoSeguimiento], null, null)
      setSuccess('Archivo de seguimiento subido correctamente')
      setArchivoSeguimiento(null)
      await seleccionarIncidencia(incidenciaActiva.id)
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo subir el archivo de seguimiento')
    }
  }

  const generarHojaAcuerdo = async () => {
    if (!incidenciaActiva) return
    if (incidenciaCerrada) {
      setError('La incidencia está cerrada y no admite cambios')
      return
    }

    try {
      const response = await acuerdosApi.generarDescarga(incidenciaActiva.id)
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `hoja_acuerdo_incidencia_${incidenciaActiva.id}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(blobUrl)
      setSuccess('Hoja PDF generada y descargada')
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo generar la hoja de acuerdo')
    }
  }

  useEffect(() => {
    cargarIncidencias()
  }, [verCerradas, filtroGrupoId, filtroSemestre])

  useEffect(() => {
    const loadGrupos = async () => {
      try {
        const response = await gruposApi.getAllSimple()
        setGrupos(response.data || [])
      } catch (err) {
        setGrupos([])
      }
    }
    loadGrupos()
  }, [])

  const incidenciasFiltradas = useMemo(() => {
    const texto = filtroTexto.trim().toLowerCase()
    if (!texto) return incidencias
    return (incidencias || []).filter((inc) => {
      const titulo = String(inc.titulo || '').toLowerCase()
      const descripcion = String(inc.descripcion || '').toLowerCase()
      const grupo = String(inc.grupo?.nombre || '').toLowerCase()
      const alumnos = (inc.alumnos || []).map((a) => String(a.nombre || '').toLowerCase()).join(' ')
      return titulo.includes(texto) || descripcion.includes(texto) || grupo.includes(texto) || alumnos.includes(texto)
    })
  }, [incidencias, filtroTexto])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Seguimiento de Incidencias</h1>
        <p className="text-gray-500">Consulta de incidencias, acuerdos, carga de copia firmada y cierre</p>
      </div>

      <div className="flex gap-2">
        <Button variant={verCerradas ? 'secondary' : 'primary'} onClick={() => setVerCerradas(false)}>
          Activas
        </Button>
        <Button variant={verCerradas ? 'primary' : 'secondary'} onClick={() => setVerCerradas(true)}>
          Cerradas (solo lectura)
        </Button>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="label">Buscar (nombre/título)</label>
            <input
              className="input"
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              placeholder="Alumno, grupo o título..."
            />
          </div>
          <div>
            <label className="label">Semestre</label>
            <select className="input" value={filtroSemestre} onChange={(e) => setFiltroSemestre(e.target.value)}>
              <option value="">Todos</option>
              <option value="1">1°</option>
              <option value="2">2°</option>
              <option value="3">3°</option>
              <option value="4">4°</option>
              <option value="5">5°</option>
              <option value="6">6°</option>
            </select>
          </div>
          <div>
            <label className="label">Grupo</label>
            <select className="input" value={filtroGrupoId} onChange={(e) => setFiltroGrupoId(e.target.value)}>
              <option value="">Todos</option>
              {grupos.map((g) => (
                <option key={g.id} value={g.id}>{g.nombre}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={() => {
                setFiltroTexto('')
                setFiltroSemestre('')
                setFiltroGrupoId('')
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-1">
          <h2 className="font-semibold mb-3">Incidencias</h2>
          <div className="space-y-2 max-h-[500px] overflow-auto">
            {incidenciasFiltradas.map((inc) => (
              <button
                key={inc.id}
                onClick={() => seleccionarIncidencia(inc.id)}
                className={`w-full text-left p-3 rounded border ${
                  incidenciaActiva?.id === inc.id ? 'border-primary bg-primary-50' : 'border-gray-200'
                }`}
              >
                <p className="font-medium">#{inc.id} - {inc.titulo}</p>
                <p className="text-sm text-gray-500 capitalize">{inc.estado}</p>
              </button>
            ))}
            {incidenciasFiltradas.length === 0 && (
              <p className="text-sm text-gray-500">No hay incidencias con los filtros seleccionados.</p>
            )}
          </div>
        </div>

        <div className="card lg:col-span-2 space-y-4">
          {!incidenciaActiva ? (
            <p className="text-gray-500">Selecciona una incidencia para ver su seguimiento.</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <div>
                  <h2 className="font-semibold">Incidencia #{incidenciaActiva.id}</h2>
                  <p className="text-sm text-gray-500">{incidenciaActiva.titulo}</p>
                </div>
                <div className="flex gap-2">
                  {!incidenciaCerrada && (
                    <>
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => cambiarEstado('en_proceso')}
                        disabled={incidenciaActiva?.estado === 'en_proceso'}
                      >
                        Marcar en proceso
                      </Button>
                      <Button size="small" variant="success" onClick={() => cambiarEstado('cerrada')}>
                        Cerrar incidencia
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {incidenciaCerrada && (
                <Alert type="warning" message="Incidencia cerrada: modo solo lectura (sin modificaciones)." />
              )}

              <div className="border rounded p-3 bg-gray-50">
                <h3 className="font-medium mb-2">Información de la incidencia</h3>
                <p className="text-sm text-gray-700">
                  <strong>Alumnos involucrados:</strong>{' '}
                  {(incidenciaActiva.alumnos || []).length > 0
                    ? incidenciaActiva.alumnos.map((al) => al.nombre).join(', ')
                    : 'Sin alumnos asociados'}
                </p>
                <p className="text-sm text-gray-700"><strong>Descripción:</strong> {incidenciaActiva.descripcion}</p>
                <p className="text-sm text-gray-700"><strong>Fecha:</strong> {new Date(incidenciaActiva.fecha).toLocaleString('es-MX')}</p>
                <p className="text-sm text-gray-700"><strong>Estado:</strong> {incidenciaActiva.estado}</p>
                <p className="text-sm text-gray-700"><strong>Severidad:</strong> {incidenciaActiva.severidad?.nombre || 'Sin clasificar'}</p>
                <p className="text-sm text-gray-700"><strong>Grupo:</strong> {incidenciaActiva.grupo?.nombre || 'Sin grupo'}</p>
              </div>

              {!incidenciaCerrada && (
                <div className="border rounded p-3 bg-white">
                <h3 className="font-medium mb-2">Hoja de acuerdo y archivo de seguimiento</h3>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Button variant="secondary" onClick={generarHojaAcuerdo}>
                      Generar hoja PDF
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      className="input max-w-sm"
                      onChange={(e) => setArchivoSeguimiento(e.target.files?.[0] || null)}
                    />
                    <Button variant="primary" onClick={subirArchivoSeguimiento}>
                      Subir archivo
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium mb-2">Archivos adjuntos de la incidencia</h3>
                <div className="space-y-2">
                  {(archivosIncidencia || []).map((archivo) => (
                    <div key={archivo.id} className="border rounded p-2 flex items-center justify-between">
                      <span className="text-sm">{archivo.nombre_original || archivo.nombre_archivo}</span>
                      <div className="flex gap-2">
                        <Button size="small" variant="secondary" onClick={() => abrirODescargarArchivo(archivo, true)}>
                          Abrir
                        </Button>
                        <Button size="small" variant="secondary" onClick={() => abrirODescargarArchivo(archivo, false)}>
                          Descargar
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(archivosIncidencia || []).length === 0 && (
                    <p className="text-sm text-gray-500">Sin archivos adjuntos.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Seguimientos
