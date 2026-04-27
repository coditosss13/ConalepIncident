import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import incidenciasApi from '../api/incidencias.api'
import archivosApi from '../api/archivos.api'
import gruposApi from '../api/grupos.api'
import Modal from '../components/common/Modal'
import Alert from '../components/common/Alert'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import IncidenciaForm from '../components/incidencias/IncidenciaForm'
import IncidenciaList from '../components/incidencias/IncidenciaList'
import IncidenciaDetail from '../components/incidencias/IncidenciaDetail'
import { Plus, Search, Filter } from 'lucide-react'

function Incidencias() {
  const { user } = useAuth()

  // Estado
  const [incidencias, setIncidencias] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Filtros
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroSeveridad, setFiltroSeveridad] = useState('')
  const [filtroGravedad, setFiltroGravedad] = useState('')
  const [filtroGrupoId, setFiltroGrupoId] = useState('')
  const [filtroSemestre, setFiltroSemestre] = useState('')
  const [mostrarCerradas, setMostrarCerradas] = useState(false)
  const [grupos, setGrupos] = useState([])

  // Modales
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedIncidencia, setSelectedIncidencia] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  // Cargar incidencias
  const loadIncidencias = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await incidenciasApi.getAll({
        page,
        limit: 10,
        search,
        estado: filtroEstado || (mostrarCerradas ? 'cerrada' : undefined),
        grupo_id: filtroGrupoId || undefined,
        semestre: filtroSemestre || undefined,
        severidad_id: filtroGravedad === 'grave'
          ? 3
          : filtroGravedad === 'no_grave'
            ? 1
            : (filtroSeveridad || undefined)
      })
      setIncidencias(response.data)
      setTotalPages(response.pagination.totalPages)
    } catch (err) {
      setError('Error al cargar las incidencias')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadIncidencias()
  }, [page, filtroEstado, filtroSeveridad, filtroGravedad, filtroGrupoId, filtroSemestre, mostrarCerradas])

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

  // Handlers
  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    loadIncidencias()
  }

  const handleCreate = () => {
    setSelectedIncidencia(null)
    setFormModalOpen(true)
  }

  const handleView = async (incidencia) => {
    try {
      setLoading(true)
      const response = await incidenciasApi.getById(incidencia.id)
      setSelectedIncidencia(response.data || incidencia)
      setDetailModalOpen(true)
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo cargar el detalle de la incidencia')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (incidencia) => {
    setSelectedIncidencia(incidencia)
    setFormModalOpen(true)
  }

  const handleDelete = async (incidencia) => {
    if (!window.confirm(`¿Está seguro de eliminar la incidencia "${incidencia.titulo}"?`)) {
      return
    }

    try {
      await incidenciasApi.delete(incidencia.id)
      setSuccess('Incidencia eliminada correctamente')
      loadIncidencias()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar incidencia')
    }
  }

  const handleChangeStatus = async (incidenciaId, estado) => {
    try {
      await incidenciasApi.changeStatus(incidenciaId, estado)
      setSuccess(`Incidencia marcada como ${estado}`)
      loadIncidencias()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar estado')
    }
  }

  const handleFormSubmit = async (data) => {
    setFormLoading(true)
    setError('')

    try {
      const { archivos = [], ...payload } = data
      if (selectedIncidencia) {
        await incidenciasApi.update(selectedIncidencia.id, payload)
        setSuccess('Incidencia actualizada correctamente')
      } else {
        const created = await incidenciasApi.create(payload)
        const incidenciaId = created?.data?.id
        if (incidenciaId && archivos.length > 0) {
          await archivosApi.upload(incidenciaId, archivos)
        }
        setSuccess('Incidencia creada correctamente')
      }
      setFormModalOpen(false)
      loadIncidencias()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar incidencia')
    } finally {
      setFormLoading(false)
    }
  }

  const puedeCrear = user?.rol !== 'alumno'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Incidencias</h1>
          <p className="text-gray-500 mt-1">
            {user?.rol === 'profesor'
              ? 'Registra y da seguimiento a las incidencias de tus alumnos'
              : 'Administra las incidencias de la institución'}
          </p>
        </div>
        {puedeCrear && (
          <Button variant="primary" onClick={handleCreate}>
            <Plus size={18} />
            Nueva Incidencia
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant={mostrarCerradas ? 'secondary' : 'primary'} onClick={() => { setMostrarCerradas(false); setPage(1) }}>
          Incidencias activas
        </Button>
        <Button variant={mostrarCerradas ? 'primary' : 'secondary'} onClick={() => { setMostrarCerradas(true); setPage(1) }}>
          Incidencias cerradas
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant={filtroGravedad === '' ? 'primary' : 'secondary'} onClick={() => { setFiltroGravedad(''); setPage(1) }}>
          Todas
        </Button>
        <Button variant={filtroGravedad === 'grave' ? 'primary' : 'secondary'} onClick={() => { setFiltroGravedad('grave'); setPage(1) }}>
          Graves
        </Button>
        <Button variant={filtroGravedad === 'no_grave' ? 'primary' : 'secondary'} onClick={() => { setFiltroGravedad('no_grave'); setPage(1) }}>
          No graves
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess('')} />
      )}

      {/* Filtros */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
          {/* Búsqueda */}
          <div className="flex-1 min-w-[200px]">
            <label className="label">Buscar</label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="input pl-10"
                placeholder="Buscar por título..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filtro por estado */}
          <div>
            <label className="label">Semestre</label>
            <select
              className="input"
              value={filtroSemestre}
              onChange={(e) => {
                setFiltroSemestre(e.target.value)
                setPage(1)
              }}
            >
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
            <select
              className="input"
              value={filtroGrupoId}
              onChange={(e) => {
                setFiltroGrupoId(e.target.value)
                setPage(1)
              }}
            >
              <option value="">Todos</option>
              {grupos.map((g) => (
                <option key={g.id} value={g.id}>{g.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Estado</label>
            <select
              className="input"
              value={filtroEstado}
              onChange={(e) => {
                setFiltroEstado(e.target.value)
                setPage(1)
              }}
            >
              <option value="">Todos</option>
              <option value="abierta">Abierta</option>
              <option value="en_proceso">En proceso</option>
              <option value="cerrada">Cerrada</option>
            </select>
          </div>

          {/* Filtro por severidad */}
          <div>
            <label className="label">Severidad</label>
            <select
              className="input"
              value={filtroSeveridad}
              onChange={(e) => {
                setFiltroSeveridad(e.target.value)
                setPage(1)
              }}
            >
              <option value="">Todas</option>
              <option value="1">Leve</option>
              <option value="2">Moderada</option>
              <option value="3">Grave</option>
            </select>
          </div>

          {/* Botones */}
          <Button type="submit" variant="primary">
            <Search size={18} />
            Buscar
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setSearch('')
              setFiltroEstado('')
              setFiltroSeveridad('')
              setFiltroGravedad('')
              setFiltroGrupoId('')
              setFiltroSemestre('')
              setPage(1)
              loadIncidencias()
            }}
          >
            Limpiar
          </Button>
        </form>
      </div>

      {/* Tabla */}
      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando incidencias...</p>
          </div>
        ) : (
          <IncidenciaList
            incidencias={incidencias}
            onEdit={handleEdit}
            onView={handleView}
            onChangeStatus={handleChangeStatus}
            onDelete={handleDelete}
            userRole={user?.rol}
            readonly={mostrarCerradas}
          />
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

      {/* Modal de Formulario */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={selectedIncidencia ? 'Editar Incidencia' : 'Nueva Incidencia'}
        size="large"
      >
        <IncidenciaForm
          incidencia={selectedIncidencia}
          roles={[]}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormModalOpen(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Modal de Detalle */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={`Incidencia #${selectedIncidencia?.id}`}
        size="large"
      >
        <IncidenciaDetail
          incidencia={selectedIncidencia}
          onClose={() => setDetailModalOpen(false)}
          userRole={user?.rol}
        />
      </Modal>
    </div>
  )
}

export default Incidencias
