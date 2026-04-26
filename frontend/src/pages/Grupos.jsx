import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import gruposApi from '../api/grupos.api'
import Modal from '../components/common/Modal'
import Alert from '../components/common/Alert'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import { Plus, Edit, Trash2, RefreshCw, Users } from 'lucide-react'

function Grupos() {
  const { canAccess } = useAuth()
  const canEdit = canAccess('prefecto')
  const canDelete = canAccess('administrador')

  // Estado
  const [grupos, setGrupos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Paginación y filtros
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [filtroSemestre, setFiltroSemestre] = useState('')

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedGrupo, setSelectedGrupo] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    semestre: '',
    ciclo_escolar: ''
  })

  const semestreOptions = [
    { value: '1', label: 'Semestre 1' },
    { value: '2', label: 'Semestre 2' },
    { value: '3', label: 'Semestre 3' },
    { value: '4', label: 'Semestre 4' },
    { value: '5', label: 'Semestre 5' },
    { value: '6', label: 'Semestre 6' }
  ]

  // Cargar grupos
  const loadGrupos = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await gruposApi.getAll({
        page,
        limit: 10,
        search,
        semestre: filtroSemestre || undefined
      })
      setGrupos(response.data)
      setTotalPages(response.pagination.totalPages)
    } catch (err) {
      setError('Error al cargar los grupos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGrupos()
  }, [page, filtroSemestre])

  // Handlers
  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    loadGrupos()
  }

  const handleCreate = () => {
    setSelectedGrupo(null)
    setFormData({ nombre: '', semestre: '', ciclo_escolar: '' })
    setModalOpen(true)
  }

  const handleEdit = (grupo) => {
    setSelectedGrupo(grupo)
    setFormData({
      nombre: grupo.nombre,
      semestre: grupo.semestre.toString(),
      ciclo_escolar: grupo.ciclo_escolar || ''
    })
    setModalOpen(true)
  }

  const handleDelete = async (grupo) => {
    if (!window.confirm(`¿Está seguro de eliminar el grupo "${grupo.nombre}"?`)) {
      return
    }

    try {
      await gruposApi.delete(grupo.id)
      setSuccess('Grupo eliminado correctamente')
      loadGrupos()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar grupo')
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setError('')

    try {
      const data = {
        ...formData,
        semestre: parseInt(formData.semestre)
      }

      if (selectedGrupo) {
        await gruposApi.update(selectedGrupo.id, data)
        setSuccess('Grupo actualizado correctamente')
      } else {
        await gruposApi.create(data)
        setSuccess('Grupo creado correctamente')
      }
      setModalOpen(false)
      loadGrupos()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar grupo')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Grupos</h1>
          <p className="text-gray-500 mt-1">Administra los grupos escolares</p>
        </div>
        {canEdit && (
          <Button variant="primary" onClick={handleCreate}>
            <Plus size={18} />
            Nuevo Grupo
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
              placeholder="Nombre del grupo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select
            label="Semestre"
            name="semestre"
            options={semestreOptions}
            placeholder="Todos"
            value={filtroSemestre}
            onChange={(e) => {
              setFiltroSemestre(e.target.value)
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
              setFiltroSemestre('')
              setPage(1)
              loadGrupos()
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
            <p className="mt-2 text-gray-500">Cargando grupos...</p>
          </div>
        ) : grupos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users size={48} className="mx-auto mb-3 opacity-50" />
            <p>No se encontraron grupos</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Semestre</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Ciclo Escolar</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Alumnos</th>
                  {canEdit && <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y">
                {grupos.map((grupo) => (
                  <tr key={grupo.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{grupo.nombre}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-primary-50 text-primary rounded text-sm">
                        Semestre {grupo.semestre}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{grupo.ciclo_escolar || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        {grupo.total_alumnos || 0} alumno(s)
                      </span>
                    </td>
                    {canEdit && (
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(grupo)}
                            className="p-2 rounded-lg hover:bg-primary-50 text-gray-500 hover:text-primary"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(grupo)}
                              className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
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
        title={selectedGrupo ? 'Editar Grupo' : 'Nuevo Grupo'}
        size="small"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Nombre del grupo"
            name="nombre"
            placeholder="Ej: 1AVP"
            required
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />

          <Select
            label="Semestre"
            name="semestre"
            options={semestreOptions}
            placeholder="Seleccionar..."
            required
            value={formData.semestre}
            onChange={(e) => setFormData({ ...formData, semestre: e.target.value })}
          />

          <Input
            label="Ciclo escolar"
            name="ciclo_escolar"
            placeholder="Ej: 2024-2025"
            value={formData.ciclo_escolar}
            onChange={(e) => setFormData({ ...formData, ciclo_escolar: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={formLoading}>
              {selectedGrupo ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Grupos