import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import usuariosApi from '../api/usuarios.api'
import Modal from '../components/common/Modal'
import Alert from '../components/common/Alert'
import Button from '../components/common/Button'
import UsuarioForm from '../components/usuarios/UsuarioForm'
import UsuarioList from '../components/usuarios/UsuarioList'
import PasswordModal from '../components/usuarios/PasswordModal'
import { UserPlus, Search, RefreshCw } from 'lucide-react'

function Usuarios() {
  const { user } = useAuth()

  // Estado
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Paginación y filtros
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [filtroRol, setFiltroRol] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')

  // Modales
  const [modalOpen, setModalOpen] = useState(false)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  // Cargar usuarios
  const loadUsuarios = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await usuariosApi.getAll({
        page,
        limit: 10,
        search,
        rol_id: filtroRol || undefined,
        activo: filtroEstado || undefined
      })
      setUsuarios(response.data)
      setTotalPages(response.pagination.totalPages)
    } catch (err) {
      setError('Error al cargar los usuarios')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Cargar roles
  const loadRoles = async () => {
    try {
      const response = await usuariosApi.getRoles()
      setRoles(response.data)
    } catch (err) {
      console.error('Error al cargar roles:', err)
    }
  }

  useEffect(() => {
    loadRoles()
  }, [])

  useEffect(() => {
    loadUsuarios()
  }, [page, filtroRol, filtroEstado])

  // Handlers
  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    loadUsuarios()
  }

  const handleCreate = () => {
    setSelectedUsuario(null)
    setModalOpen(true)
  }

  const handleEdit = (usuario) => {
    setSelectedUsuario(usuario)
    setModalOpen(true)
  }

  const handleDelete = async (usuario) => {
    if (!window.confirm(`¿Está seguro de desactivar al usuario "${usuario.nombre}"?`)) {
      return
    }

    try {
      await usuariosApi.delete(usuario.id)
      setSuccess('Usuario desactivado correctamente')
      loadUsuarios()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al desactivar usuario')
    }
  }

  const handleRestore = async (usuario) => {
    try {
      await usuariosApi.restore(usuario.id)
      setSuccess('Usuario activado correctamente')
      loadUsuarios()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al activar usuario')
    }
  }

  const handleChangePassword = (usuario) => {
    setSelectedUsuario(usuario)
    setPasswordModalOpen(true)
  }

  const handleFormSubmit = async (data) => {
    setFormLoading(true)
    setError('')

    try {
      if (selectedUsuario) {
        await usuariosApi.update(selectedUsuario.id, data)
        setSuccess('Usuario actualizado correctamente')
      } else {
        await usuariosApi.create(data)
        setSuccess('Usuario creado correctamente')
      }
      setModalOpen(false)
      loadUsuarios()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar usuario')
    } finally {
      setFormLoading(false)
    }
  }

  const handlePasswordSubmit = async (userId, newPassword) => {
    setFormLoading(true)
    try {
      await usuariosApi.changePassword(userId, newPassword)
      setSuccess('Contraseña actualizada correctamente')
      setPasswordModalOpen(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar contraseña')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <p className="text-gray-500 mt-1">Administra los usuarios del sistema</p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          <UserPlus size={18} />
          Nuevo Usuario
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
                placeholder="Nombre o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filtro por rol */}
          <div>
            <label className="label">Rol</label>
            <select
              className="input"
              value={filtroRol}
              onChange={(e) => {
                setFiltroRol(e.target.value)
                setPage(1)
              }}
            >
              <option value="">Todos</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre.charAt(0).toUpperCase() + rol.nombre.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por estado */}
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
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>

          {/* Botones */}
          <Button type="submit" variant="primary">
            <Search size={18} />
            Buscar
          </Button>
          <Button type="button" variant="secondary" onClick={() => {
            setSearch('')
            setFiltroRol('')
            setFiltroEstado('')
            setPage(1)
            loadUsuarios()
          }}>
            <RefreshCw size={18} />
            Limpiar
          </Button>
        </form>
      </div>

      {/* Tabla */}
      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando usuarios...</p>
          </div>
        ) : (
          <UsuarioList
            usuarios={usuarios}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
            onChangePassword={handleChangePassword}
            currentUserId={user?.id}
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

      {/* Modal de Usuario */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
        size="medium"
      >
        <UsuarioForm
          usuario={selectedUsuario}
          roles={roles}
          onSubmit={handleFormSubmit}
          onCancel={() => setModalOpen(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Modal de Contraseña */}
      <PasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        usuario={selectedUsuario}
        onSubmit={handlePasswordSubmit}
        loading={formLoading}
      />
    </div>
  )
}

export default Usuarios