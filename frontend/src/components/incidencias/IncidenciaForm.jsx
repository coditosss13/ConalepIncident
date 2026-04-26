import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import gruposApi from '../../api/grupos.api'
import alumnosApi from '../../api/alumnos.api'
import incidenciasApi from '../../api/incidencias.api'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import Alert from '../common/Alert'

function IncidenciaForm({ incidencia, onSubmit, onCancel, loading }) {
  const [grupos, setGrupos] = useState([])
  const [alumnos, setAlumnos] = useState([])
  const [razones, setRazones] = useState([])
  const [alumnosSeleccionados, setAlumnosSeleccionados] = useState([])
  const [error, setError] = useState('')
  const [archivos, setArchivos] = useState([])
  const [alumnoSearch, setAlumnoSearch] = useState('')
  const [razonSeleccionada, setRazonSeleccionada] = useState(incidencia?.titulo || '')

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: incidencia || {
      descripcion: '',
      razon: '',
      grupo_id: ''
    }
  })

  // Cargar grupos y alumnos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const gruposRes = await gruposApi.getAll()
        setGrupos(gruposRes.data)

        const alumnosRes = await alumnosApi.getAll({ activo: true })
        setAlumnos(alumnosRes.data)
        const razonesRes = await incidenciasApi.getCatalogoRazones()
        setRazones(razonesRes.data || [])

        // Si es edición, cargar datos existentes
        if (incidencia) {
          setAlumnosSeleccionados(incidencia.alumnos?.map(a => a.id) || [])
          const razonExistente = (razonesRes.data || []).find((r) => r.label === incidencia.titulo)
          if (razonExistente) {
            setValue('razon', razonExistente.key)
            setRazonSeleccionada(razonExistente.key)
          }
        }
      } catch (err) {
        console.error('Error al cargar datos:', err)
      }
    }
    cargarDatos()
  }, [incidencia])

  // Mostrar alumnos de todos los grupos para permitir incidencias multi-grupo
  const alumnosFiltrados = alumnos.filter((alumno) => {
    const matchTexto = !alumnoSearch ||
      alumno.nombre?.toLowerCase().includes(alumnoSearch.toLowerCase()) ||
      alumno.matricula?.toLowerCase().includes(alumnoSearch.toLowerCase())
    return matchTexto
  })

  // Toggle selección de alumno
  const toggleAlumno = (alumnoId) => {
    setAlumnosSeleccionados(prev =>
      prev.includes(alumnoId)
        ? prev.filter(id => id !== alumnoId)
        : [...prev, alumnoId]
    )
  }

  // Seleccionar todos los alumnos del grupo
  const seleccionarTodos = () => {
    const ids = alumnosFiltrados.map(a => a.id)
    setAlumnosSeleccionados(ids)
  }

  // Deseleccionar todos
  const deseleccionarTodos = () => {
    setAlumnosSeleccionados([])
  }

  const handleFormSubmit = async (data) => {
    if (alumnosSeleccionados.length === 0) {
      setError('Debe seleccionar al menos un alumno')
      return
    }

    setError('')
    const razonObj = razones.find((r) => r.key === data.razon)
    if (!razonObj) {
      setError('Selecciona una razon de incidencia valida')
      return
    }
    await onSubmit({
      ...data,
      razon: razonObj.key,
      titulo: razonObj.label,
      severidad_id: razonObj.severidad_id,
      grupo_id: data.grupo_id ? parseInt(data.grupo_id) : null,
      alumno_ids: alumnosSeleccionados,
      archivos
    })
  }

  const grupoRegister = register('grupo_id', { valueAsNumber: true })
  const razonRegister = register('razon', {
    required: 'La razon de la incidencia es requerida'
  })

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Razon */}
      <Select
        label="Razon de la incidencia"
        options={[
          { value: '', label: 'Seleccione una razon...' },
          ...razones.map((r) => ({
            value: r.key,
            label: `${r.label} (${r.gravedad === 'grave' ? 'Grave' : 'No grave'})`
          }))
        ]}
        error={errors.razon?.message}
        {...razonRegister}
        onChange={(e) => {
          razonRegister.onChange(e)
          setRazonSeleccionada(e.target.value)
        }}
      />

      {razonSeleccionada && (
        <div className="bg-blue-50 border border-blue-200 rounded-md px-3 py-2 text-sm text-blue-800">
          Gravedad asignada automaticamente:{' '}
          <strong>
            {razones.find((r) => r.key === razonSeleccionada)?.gravedad === 'grave' ? 'Grave' : 'No grave'}
          </strong>
        </div>
      )}

      {/* Descripción */}
      <div>
        <label className="label">Descripción</label>
        <textarea
          className="input min-h-[120px]"
          placeholder="Describa detalladamente la incidencia..."
          {...register('descripcion', {
            required: 'La descripción es requerida'
          })}
        />
        {errors.descripcion && (
          <span className="text-red-500 text-sm">{errors.descripcion.message}</span>
        )}
      </div>

      {/* Grupo */}
      <Select
        label="Grupo de referencia (opcional)"
        options={[
          { value: '', label: 'Automático por alumnos seleccionados' },
          ...grupos.map(g => ({
            value: g.id,
            label: `${g.nombre} - ${g.semestre}° semestre`
          }))
        ]}
        error={errors.grupo_id?.message}
        {...grupoRegister}
      />

      {/* Selección de alumnos */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="mb-3">
          <Input
            label="Buscar alumno por nombre o matrícula"
            placeholder="Escribe para filtrar..."
            value={alumnoSearch}
            onChange={(e) => setAlumnoSearch(e.target.value)}
          />
        </div>
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <label className="label mb-0">
              Alumnos involucrados ({alumnosSeleccionados.length})
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={seleccionarTodos}
              >
                Seleccionar todos
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={deseleccionarTodos}
              >
                Deseleccionar todos
              </Button>
            </div>
          </div>

          {alumnosFiltrados.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay alumnos que coincidan con el filtro</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {alumnosFiltrados.map(alumno => (
                <label
                  key={alumno.id}
                  className="flex items-center gap-2 p-2 rounded hover:bg-white cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={alumnosSeleccionados.includes(alumno.id)}
                    onChange={() => toggleAlumno(alumno.id)}
                    className="rounded text-primary"
                  />
                  <span className="text-sm">
                    {alumno.nombre} ({alumno.matricula}) - {alumno.grupo?.nombre || 'Sin grupo'}
                  </span>
                </label>
              ))}
            </div>
          )}

          {errors.alumno_ids && (
            <span className="text-red-500 text-sm">{errors.alumno_ids.message}</span>
          )}
        </div>
      </div>

      {/* Botones */}
      <div>
        <label className="label">Evidencias (imágenes/PDF)</label>
        <input
          type="file"
          multiple
          accept="image/*,application/pdf"
          className="input"
          onChange={(event) => setArchivos(Array.from(event.target.files || []))}
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Guardando...' : incidencia ? 'Actualizar' : 'Crear'} Incidencia
        </Button>
      </div>
    </form>
  )
}

export default IncidenciaForm
