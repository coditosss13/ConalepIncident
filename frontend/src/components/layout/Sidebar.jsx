import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard,
  FileText,
  Users,
  GraduationCap,
  Layers,
  BarChart3,
  ClipboardList,
  Settings,
  LogOut
} from 'lucide-react'

function Sidebar() {
  const { user, logout, canAccess } = useAuth()

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
      roles: ['profesor', 'prefecto', 'administrador']
    },
    {
      title: 'Incidencias',
      path: '/incidencias',
      icon: FileText,
      roles: ['profesor', 'prefecto', 'administrador']
    },
    {
      title: 'Seguimientos',
      path: '/seguimientos',
      icon: ClipboardList,
      roles: ['prefecto', 'administrador']
    },
    {
      title: 'Métricas',
      path: '/metricas',
      icon: BarChart3,
      roles: ['prefecto', 'administrador']
    },
    {
      title: 'Alumnos',
      path: '/alumnos',
      icon: GraduationCap,
      roles: ['profesor', 'prefecto', 'administrador']
    },
    {
      title: 'Grupos',
      path: '/grupos',
      icon: Layers,
      roles: ['prefecto', 'administrador']
    },
    {
      title: 'Usuarios',
      path: '/usuarios',
      icon: Users,
      roles: ['administrador']
    }
  ]

  const filteredMenu = menuItems.filter(item =>
    item.roles.includes(user?.rol?.nombre)
  )

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-800">Conalep</h1>
            <p className="text-xs text-gray-500">Incidencias</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {filteredMenu.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3 px-4">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary font-semibold">
              {user?.nombre?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 truncate">{user?.nombre}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.rol?.nombre}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar