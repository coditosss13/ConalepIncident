import { useAuth } from '../../context/AuthContext'
import { Bell, User } from 'lucide-react'

function Header() {
  const { user } = useAuth()

  const getRoleBadge = (rol) => {
    const badges = {
      'administrador': 'bg-red-100 text-red-700',
      'prefecto': 'bg-blue-100 text-blue-700',
      'profesor': 'bg-green-100 text-green-700'
    }
    return badges[rol] || 'bg-gray-100 text-gray-700'
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Bienvenido, {user?.nombre}
          </h2>
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${getRoleBadge(user?.rol?.nombre)}`}>
            {user?.rol?.nombre}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Notificaciones */}
          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <Bell size={20} className="text-gray-500" />
            {/* Badge de notificaciones */}
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Perfil */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header