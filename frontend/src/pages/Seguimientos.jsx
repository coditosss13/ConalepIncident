import { useEffect, useMemo, useState } from 'react'
import incidenciasApi from '../api/incidencias.api'
import acuerdosApi from '../api/acuerdos.api'
import alumnosApi from '../api/alumnos.api'
import Alert from '../components/common/Alert'
import Button from '../components/common/Button'

const isValidPhoneFlexible = (phone) => {
  const value = String(phone || '').trim()
  const validChars = /^[\d+\-().\s/]+$/.test(value)
  const digits = (value.match(/\d/g) || []).length
  return validChars && digits >= 7 && digits <= 16
}

function Seguimientos() {
  const [incidencias, setIncidencias] = useState([])
  const [incidenciaActiva, setIncidenciaActiva] = useState(null)
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [acuerdos, setAcuerdos] = useState([])
  const [verCerradas, setVerCerradas] = useState(false)
  const [nombreTutor, setNombreTutor] = useState('')
  const [telefonoTutor, setTelefonoTutor] = useState('')
  const [parentesco, setParentesco] = useState('')
  const [seguimientoSeleccionadoId, setSeguimientoSeleccionadoId] = useState(null)
  const incidenciaCerrada = incidenciaActiva?.estado === 'cerrada'

  const cargarIncidencias = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await incidenciasApi.getAll({
        page: 1,
        limit: 50,
        estado: verCerradas ? 'cerrada' : undefined
      })
      setIncidencias(response.data || [])
      if (!incidenciaActiva && response.data?.length) {
        await seleccionarIncidencia(response.data[0].id, { resetAlumno: true })
      }
    } catch (err) {
      setError('No se pudieron cargar las incidencias para seguimiento')
    } finally {
      setLoading(false)
    }
  }

  const seleccionarIncidencia = async (id, options = {}) => {
    const { resetAlumno = true } = options
    setLoading(true)
    try {
      const detail = await incidenciasApi.getById(id)
      setIncidenciaActiva(detail.data)
      if (resetAlumno) {
        setAlumnoSeleccionado('')
      } else {
        const alumnoExiste = detail.data?.alumnos?.some((al) => al.id === Number(alumnoSeleccionado))
        if (!alumnoExiste) {
          setAlumnoSeleccionado('')
        }
      }
      // Resetear datos de tutor al cambiar de incidencia para evitar fugas de contexto.
      setNombreTutor('')
      setTelefonoTutor('')
      setParentesco('')
      setSeguimientoSeleccionadoId(null)
      const acuerdosRes = await acuerdosApi.getByIncidencia(id)
      setAcuerdos(acuerdosRes.data || [])
    } catch (err) {
      setError('No se pudo cargar el detalle de la incidencia')
    } finally {
      setLoading(false)
    }
  }

  const agregarSeguimiento = async () => {
    if (!incidenciaActiva || !descripcion.trim()) return
    if (incidenciaCerrada) {
      setError('La incidencia está cerrada y no admite cambios')
      return
    }
    try {
      await incidenciasApi.addSeguimiento(incidenciaActiva.id, {
        descripcion,
        alumno_id: alumnoSeleccionado ? Number(alumnoSeleccionado) : undefined
      })
      setDescripcion('')
      setSuccess('Seguimiento guardado')
      await seleccionarIncidencia(incidenciaActiva.id, { resetAlumno: false })
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo guardar seguimiento')
    }
  }

  const cambiarEstado = async (estado) => {
    if (!incidenciaActiva) return
    if (incidenciaCerrada) {
      setError('La incidencia está cerrada y no admite cambios')
      return
    }
    try {
      await incidenciasApi.changeStatus(incidenciaActiva.id, estado)
      setSuccess(`Incidencia actualizada a ${estado}`)
      await seleccionarIncidencia(incidenciaActiva.id, { resetAlumno: false })
      await cargarIncidencias()
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo actualizar estado')
    }
  }

  const generarAcuerdo = async () => {
    if (!incidenciaActiva || !alumnoSeleccionado) {
      setError('Selecciona un alumno para generar acuerdo')
      return
    }
    if (!nombreTutor.trim() || !telefonoTutor.trim()) {
      setError('Captura nombre y teléfono del tutor para generar el acuerdo')
      return
    }
    if (!isValidPhoneFlexible(telefonoTutor)) {
      setError('El teléfono del tutor no tiene un formato válido')
      return
    }
    if (incidenciaCerrada) {
      setError('La incidencia está cerrada y no admite cambios')
      return
    }
    try {
      await acuerdosApi.generar(incidenciaActiva.id, Number(alumnoSeleccionado), {
        nombre_tutor: nombreTutor.trim(),
        telefono_tutor: telefonoTutor.trim(),
        parentesco: parentesco.trim()
      })
      setSuccess('Acuerdo generado')
      await seleccionarIncidencia(incidenciaActiva.id, { resetAlumno: false })
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo generar acuerdo')
    }
  }

  const descargarAcuerdo = async (acuerdoId, abrir = false) => {
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
      setError('No se pudo descargar el acuerdo')
    }
  }

  const seguimientosFiltrados = useMemo(() => {
    if (!incidenciaActiva) return []
    if (!alumnoSeleccionado) return incidenciaActiva.seguimientos || []
    return (incidenciaActiva.seguimientos || []).filter(
      (seg) => !seg.alumno_id || seg.alumno_id === Number(alumnoSeleccionado)
    )
  }, [incidenciaActiva, alumnoSeleccionado])

  useEffect(() => {
    const autocompletarTutor = async () => {
      if (!alumnoSeleccionado || !incidenciaActiva?.id) {
        setNombreTutor('')
        setTelefonoTutor('')
        setParentesco('')
        return
      }

      try {
        const alumnoRes = await alumnosApi.getById(Number(alumnoSeleccionado))
        const alumno = alumnoRes?.data || {}
        const nombreDesdeAlumno = alumno.nombre_tutor || ''
        const telefonoDesdeAlumno = alumno.telefono_tutor || ''
        const parentescoDesdeAlumno = alumno.parentesco_tutor || ''

        if (nombreDesdeAlumno || telefonoDesdeAlumno || parentescoDesdeAlumno) {
          setNombreTutor(nombreDesdeAlumno)
          setTelefonoTutor(telefonoDesdeAlumno)
          setParentesco(parentescoDesdeAlumno)
          return
        }
      } catch (errorAlumno) {
        // Si falla consulta de alumno, intentar fallback con acuerdos.
      }

      const ultimoAcuerdoAlumno = [...acuerdos]
        .filter(
          (ac) =>
            Number(ac.alumno_id) === Number(alumnoSeleccionado) &&
            Number(ac.incidencia_id) === Number(incidenciaActiva.id)
        )
        .sort((a, b) => new Date(b.fecha || 0).getTime() - new Date(a.fecha || 0).getTime())[0]

      if (!ultimoAcuerdoAlumno) {
        setNombreTutor('')
        setTelefonoTutor('')
        setParentesco('')
        return
      }

      setNombreTutor(ultimoAcuerdoAlumno.nombre_tutor || '')
      setTelefonoTutor(ultimoAcuerdoAlumno.telefono_tutor || '')
      setParentesco(ultimoAcuerdoAlumno.parentesco || '')
    }

    autocompletarTutor()
  }, [alumnoSeleccionado, acuerdos, incidenciaActiva?.id])

  useEffect(() => {
    cargarIncidencias()
  }, [verCerradas])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Seguimiento de Incidencias</h1>
        <p className="text-gray-500">Gestión individual por alumno con acuerdos y cierre</p>
      </div>

      <div className="flex gap-2">
        <Button variant={verCerradas ? 'secondary' : 'primary'} onClick={() => setVerCerradas(false)}>
          Activas
        </Button>
        <Button variant={verCerradas ? 'primary' : 'secondary'} onClick={() => setVerCerradas(true)}>
          Cerradas (solo lectura)
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-1">
          <h2 className="font-semibold mb-3">Incidencias</h2>
          <div className="space-y-2 max-h-[500px] overflow-auto">
            {incidencias.map((inc) => (
              <button
                key={inc.id}
                onClick={() => seleccionarIncidencia(inc.id, { resetAlumno: true })}
                className={`w-full text-left p-3 rounded border ${
                  incidenciaActiva?.id === inc.id ? 'border-primary bg-primary-50' : 'border-gray-200'
                }`}
              >
                <p className="font-medium">#{inc.id} - {inc.titulo}</p>
                <p className="text-sm text-gray-500">{inc.estado}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="card lg:col-span-2 space-y-4">
          {!incidenciaActiva ? (
            <p className="text-gray-500">Selecciona una incidencia para iniciar seguimiento.</p>
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
                      <Button size="small" variant="secondary" onClick={() => cambiarEstado('en_proceso')}>Marcar en proceso</Button>
                      <Button size="small" variant="success" onClick={() => cambiarEstado('cerrada')}>Cerrar incidencia</Button>
                    </>
                  )}
                </div>
              </div>

              {incidenciaCerrada && (
                <Alert type="warning" message="Incidencia cerrada: modo solo lectura (sin modificaciones)." />
              )}

              <div>
                <label className="label">Alumno para seguimiento/acuerdo</label>
                <select
                  className="input"
                  value={alumnoSeleccionado}
                  onChange={(e) => setAlumnoSeleccionado(e.target.value)}
                >
                  <option value="">General de incidencia</option>
                  {incidenciaActiva.alumnos?.map((al) => (
                    <option key={al.id} value={al.id}>
                      {al.nombre} ({al.matricula}) - {al.IncidenciaAlumnos?.grupo_snapshot || 'Sin grupo'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                {!incidenciaCerrada && (
                  <Button variant="secondary" onClick={generarAcuerdo}>Generar acuerdo PDF</Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="label">Nombre del tutor</label>
                  <input
                    className="input"
                    value={nombreTutor}
                    onChange={(e) => setNombreTutor(e.target.value)}
                    placeholder="Nombre del padre, madre o tutor"
                    disabled={incidenciaCerrada}
                  />
                </div>
                <div>
                  <label className="label">Teléfono del tutor</label>
                  <input
                    type="tel"
                    className="input"
                    value={telefonoTutor}
                    onChange={(e) => setTelefonoTutor(e.target.value)}
                    placeholder="Ej. (664) 123-4567 o +1 619 555 1234"
                    disabled={incidenciaCerrada}
                  />
                </div>
                <div>
                  <label className="label">Parentesco</label>
                  <input
                    className="input"
                    value={parentesco}
                    onChange={(e) => setParentesco(e.target.value)}
                    placeholder="Ej. Madre / Padre / Tutor"
                    disabled={incidenciaCerrada}
                  />
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Acuerdos</h3>
                <div className="space-y-2">
                  {acuerdos.map((acuerdo) => (
                    <div key={acuerdo.id} className="border rounded p-2 flex justify-between items-center">
                      <span className="text-sm">
                        Alumno: {acuerdo.alumno?.nombre || acuerdo.alumno_id} - {acuerdo.firmado ? 'Firmado' : 'Pendiente'}
                      </span>
                      <div className="flex gap-2">
                        <Button size="small" variant="secondary" onClick={() => descargarAcuerdo(acuerdo.id, true)}>Abrir PDF</Button>
                        <Button size="small" variant="secondary" onClick={() => descargarAcuerdo(acuerdo.id, false)}>Descargar PDF</Button>
                      </div>
                    </div>
                  ))}
                  {acuerdos.length === 0 && <p className="text-sm text-gray-500">Sin acuerdos generados.</p>}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Nuevo seguimiento</h3>
                <textarea
                  className="input min-h-[90px]"
                  placeholder="Describe acciones, acuerdos verbales, compromisos y observaciones..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
                <div className="mt-2">
                  {!incidenciaCerrada && (
                    <Button onClick={agregarSeguimiento} loading={loading}>Guardar seguimiento</Button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Historial de seguimiento</h3>
                <div className="space-y-2 max-h-[260px] overflow-auto">
                  {seguimientosFiltrados.map((seg) => (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => {
                        setSeguimientoSeleccionadoId(seg.id)
                        setDescripcion(seg.descripcion || '')
                        if (seg.alumno_id) {
                          setAlumnoSeleccionado(String(seg.alumno_id))
                        }
                      }}
                      className={`border rounded p-2 w-full text-left ${
                        seguimientoSeleccionadoId === seg.id ? 'border-primary bg-primary-50' : ''
                      }`}
                    >
                      <div className="text-xs text-gray-500">
                        {new Date(seg.fecha).toLocaleString('es-MX')} - {seg.usuario?.nombre || 'Sistema'}
                      </div>
                      {seg.alumno && <div className="text-xs text-primary">Alumno: {seg.alumno.nombre}</div>}
                      <div className="text-sm">{seg.descripcion}</div>
                    </button>
                  ))}
                  {seguimientosFiltrados.length === 0 && <p className="text-sm text-gray-500">Sin seguimientos.</p>}
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
