import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import alumnosApi from '../api/alumnos.api'
import gruposApi from '../api/grupos.api'
import Modal from '../components/common/Modal'
import Alert from '../components/common/Alert'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import { Plus, Edit, Trash2, RefreshCw, UserCheck, RotateCcw } from 'lucide-react'

function Alumnos() {
  const { canAccess } = useAuth()
  const canEdit = canAccess('prefecto')
  const canDelete = canAccess('administrador')

  // Estado
  const [alumnos, setAlumnos] = useState([])
  const [grupos, setGrupos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Paginación y filtros
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [filtroGrupo, setFiltroGrupo] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAlumno, setSelectedAlumno] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    matricula: '',
    nombre_tutor: '',
    telefono_tutor: '',
    parentesco_tutor: '',
    grupo_actual_id: ''
  })

  // Cargar grupos para el select
  useEffect(() => {
    const loadGrupos = async () => {
      try {
        const response = await gruposApi.getAllSimple()
        setGrupos(response.data)
      } catch (err) {
        console.error('Error al cargar grupos:', err)
      }
    }
    loadGrupos()
  }, [])

  // Cargar alumnos
  const loadAlumnos = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await alumnosApi.getAll({
        page,
        limit: 10,
        search,
        grupo_id: filtroGrupo || undefined,
        activo: filtroEstado || undefined
      })
      setAlumnos(response.data)
      setTotalPages(response.pagination.totalPages)
    } catch (err) {
      setError('Error al cargar los alumnos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAlumnos()
  }, [page, filtroGrupo, filtroEstado])

  // Handlers
  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    loadAlumnos()
  }

  const handleCreate = () => {
    setSelectedAlumno(null)
    setFormData({
      nombre: '',
      matricula: '',
      nombre_tutor: '',
      telefono_tutor: '',
      parentesco_tutor: '',
      grupo_actual_id: ''
    })
    setModalOpen(true)
  }

  const handleEdit = (alumno) => {
    setSelectedAlumno(alumno)
    setFormData({
      nombre: alumno.nombre,
      matricula: alumno.matricula,
      nombre_tutor: alumno.nombre_tutor || '',
      telefono_tutor: alumno.telefono_tutor || '',
      parentesco_tutor: alumno.parentesco_tutor || '',
      grupo_actual_id: alumno.grupo_actual_id?.toString() || ''
    })
    setModalOpen(true)
  }

  const handleDelete = async (alumno) => {
    if (!window.confirm(`¿Está seguro de desactivar al alumno "${alumno.nombre}"?`)) {
      return
    }

    try {
      await alumnosApi.delete(alumno.id)
      setSuccess('Alumno desactivado correctamente')
      loadAlumnos()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al desactivar alumno')
    }
  }

  const handleRestore = async (alumno) => {
    try {
      await alumnosApi.restore(alumno.id)
      setSuccess('Alumno activado correctamente')
      loadAlumnos()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al activar alumno')
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setError('')

    try {
      const data = {
        ...formData,
        grupo_actual_id: formData.grupo_actual_id ? parseInt(formData.grupo_actual_id) : null
      }

      if (selectedAlumno) {
        await alumnosApi.update(selectedAlumno.id, data)
        setSuccess('Alumno actualizado correctamente')
      } else {
        await alumnosApi.create(data)
        setSuccess('Alumno creado correctamente')
      }
      setModalOpen(false)
      loadAlumnos()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar alumno')
    } finally {
      setFormLoading(false)
    }
  }

  const grupoOptions = grupos.map(g => ({
    value: g.id.toString(),
    label: `${g.nombre} (Sem ${g.semestre})`
  }))

  const estadoOptions = [
    { value: 'true', label: 'Activos' },
    { value: 'false', label: 'Inactivos' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Alumnos</h1>
          <p className="text-gray-500 mt-1">Administra los alumnos del sistema</p>
        </div>
        {canEdit && (
          <Button variant="primary" onClick={handleCreate}>
            <Plus size={18} />
            Nuevo Alumno
          </Button>
        )}
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Filtros */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <Input
              label="Buscar"
              placeholder="Nombre o matrícula..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select
            label="Grupo"
            name="grupo"
            options={grupoOptions}
            placeholder="Todos"
            value={filtroGrupo}
            onChange={(e) => {
              setFiltroGrupo(e.target.value)
              setPage(1)
            }}
          />

          <Select
            label="Estado"
            name="estado"
            options={estadoOptions}
            placeholder="Todos"
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value)
              setPage(1)
            }}
          />

          <Button type="submit" variant="primary">
            Buscar
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setSearch('')
              setFiltroGrupo('')
              setFiltroEstado('')
              setPage(1)
              loadAlumnos()
            }}
          >
            <RefreshCw size={18} />
          </Button>
        </form>
      </div>

      {/* Tabla */}
      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando alumnos...</p>
          </div>
        ) : alumnos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <UserCheck size={48} className="mx-auto mb-3 opacity-50" />
            <p>No se encontraron alumnos</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Matrícula</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Grupo</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Estado</th>
                  {canEdit && <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y">
                {alumnos.map((alumno) => (
                  <tr key={alumno.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold">
                            {alumno.nombre.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-gray-800">{alumno.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{alumno.matricula}</td>
                    <td className="px-4 py-3">
                      {alumno.grupo ? (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                          {alumno.grupo.nombre}
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-sm">
                          Sin grupo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        alumno.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {alumno.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    {canEdit && (
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(alumno)}
                            className="p-2 rounded-lg hover:bg-primary-50 text-gray-500 hover:text-primary"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          {alumno.activo ? (
                            canDelete && (
                              <button
                                onClick={() => handleDelete(alumno)}
                                className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600"
                                title="Desactivar"
                              >
                                <Trash2 size={18} />
                              </button>
                            )
                          ) : (
                            <button
                              onClick={() => handleRestore(alumno)}
                              className="p-2 rounded-lg hover:bg-green-50 text-gray-500 hover:text-green-600"
                              title="Activar"
                            >
                              <RotateCcw size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4 pt-4 border-t">
            <Button
              variant="secondary"
              size="small"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>
            <span className="py-1 px-3 text-gray-600">
              Página {page} de {totalPages}
            </span>
            <Button
              variant="secondary"
              size="small"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedAlumno ? 'Editar Alumno' : 'Nuevo Alumno'}
        size="small"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Nombre completo"
            name="nombre"
            placeholder="Juan Pérez García"
            required
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />

          <Input
            label="Matrícula"
            name="matricula"
            placeholder="2024001234"
            required
            value={formData.matricula}
            onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
          />

          <Input
            label="Nombre del tutor"
            name="nombre_tutor"
            placeholder="Nombre del padre, madre o tutor"
            value={formData.nombre_tutor}
            onChange={(e) => setFormData({ ...formData, nombre_tutor: e.target.value })}
          />

          <Input
            label="Teléfono del tutor"
            name="telefono_tutor"
            placeholder="Ej. (664) 123-4567 o +1 619 555 1234"
            value={formData.telefono_tutor}
            onChange={(e) => setFormData({ ...formData, telefono_tutor: e.target.value })}
          />

          <Input
            label="Parentesco del tutor"
            name="parentesco_tutor"
            placeholder="Ej. Padre, Madre, Tutor"
            value={formData.parentesco_tutor}
            onChange={(e) => setFormData({ ...formData, parentesco_tutor: e.target.value })}
          />

          <Select
            label="Grupo"
            name="grupo"
            options={grupoOptions}
            placeholder="Seleccionar grupo..."
            value={formData.grupo_actual_id}
            onChange={(e) => setFormData({ ...formData, grupo_actual_id: e.target.value })}
          />

          {selectedAlumno && (
            <Select
              label="Estado"
              name="activo"
              options={[
                { value: 'true', label: 'Activo' },
                { value: 'false', label: 'Inactivo' }
              ]}
              value={selectedAlumno.activo ? 'true' : 'false'}
              onChange={(e) => setSelectedAlumno({ ...selectedAlumno, activo: e.target.value === 'true' })}
            />
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              {selectedAlumno ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Alumnos