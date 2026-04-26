import { Edit, Trash2, UserPlus, RotateCcw, Key } from 'lucide-react'

function UsuarioList({ usuarios, onEdit, onDelete, onRestore, onChangePassword, currentUserId }) {
  const getRoleBadge = (rol) => {
    const badges = {
      administrador: 'bg-red-100 text-red-700',
      prefecto: 'bg-blue-100 text-blue-700',
      profesor: 'bg-green-100 text-green-700'
    }
    return badges[rol] || 'bg-gray-100 text-gray-700'
  }

  const getStatusBadge = (activo) => {
    return activo
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700'
  }

  if (usuarios.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <UserPlus size={48} className="mx-auto mb-3 opacity-50" />
        <p>No se encontraron usuarios</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Nombre</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Rol</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Estado</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {usuario.nombre.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-gray-800">{usuario.nombre}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600">{usuario.email}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getRoleBadge(usuario.rol?.nombre)}`}>
                  {usuario.rol?.nombre}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(usuario.activo)}`}>
                  {usuario.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {/* Cambiar contraseña */}
                  <button
                    onClick={() => onChangePassword(usuario)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                    title="Cambiar contraseña"
                  >
                    <Key size={18} />
                  </button>

                  {/* Editar */}
                  <button
                    onClick={() => onEdit(usuario)}
                    className="p-2 rounded-lg hover:bg-primary-50 text-gray-500 hover:text-primary"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>

                  {/* Eliminar / Restaurar */}
                  {usuario.activo ? (
                    <button
                      onClick={() => onDelete(usuario)}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600"
                      title="Desactivar"
                      disabled={usuario.id === currentUserId}
                    >
                      <Trash2 size={18} className={usuario.id === currentUserId ? 'opacity-50' : ''} />
                    </button>
                  ) : (
                    <button
                      onClick={() => onRestore(usuario)}
                      className="p-2 rounded-lg hover:bg-green-50 text-gray-500 hover:text-green-600"
                      title="Activar"
                    >
                      <RotateCcw size={18} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsuarioList