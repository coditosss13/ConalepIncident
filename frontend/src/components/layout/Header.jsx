import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import incidenciasApi from '../../api/incidencias.api'

function Header() {
  const { user, canAccess } = useAuth()
  const [menuPendientesOpen, setMenuPendientesOpen] = useState(false)
  const [pendientes, setPendientes] = useState({ abiertas: 0, enProceso: 0 })
  const [loadingPendientes, setLoadingPendientes] = useState(false)
  const menuRef = useRef(null)

  const getRoleBadge = (rol) => {
    const badges = {
      'administrador': 'bg-red-100 text-red-700',
      'prefecto': 'bg-blue-100 text-blue-700',
      'profesor': 'bg-green-100 text-green-700'
    }
    return badges[rol] || 'bg-gray-100 text-gray-700'
  }

  const totalPendientes = pendientes.abiertas + pendientes.enProceso

  useEffect(() => {
    const cargarPendientes = async () => {
      setLoadingPendientes(true)
      try {
        const [abiertasRes, enProcesoRes] = await Promise.all([
          incidenciasApi.getAll({ page: 1, limit: 1, estado: 'abierta' }),
          incidenciasApi.getAll({ page: 1, limit: 1, estado: 'en_proceso' })
        ])
        setPendientes({
          abiertas: Number(abiertasRes?.pagination?.total || 0),
          enProceso: Number(enProcesoRes?.pagination?.total || 0)
        })
      } catch (error) {
        setPendientes({ abiertas: 0, enProceso: 0 })
      } finally {
        setLoadingPendientes(false)
      }
    }

    cargarPendientes()
  }, [])

  useEffect(() => {
    const onClickOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setMenuPendientesOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

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
          <div className="relative" ref={menuRef}>
            <button
              className="p-2 rounded-full hover:bg-gray-100 relative"
              onClick={() => setMenuPendientesOpen((prev) => !prev)}
              title="Pendientes"
            >
              <Bell size={20} className="text-gray-500" />
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] leading-[18px] rounded-full text-center font-semibold">
                {totalPendientes}
              </span>
            </button>

            {menuPendientesOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Pendientes</h3>

                {loadingPendientes ? (
                  <p className="text-sm text-gray-500">Cargando...</p>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/incidencias"
                      onClick={() => setMenuPendientesOpen(false)}
                      className="block p-2 rounded hover:bg-gray-50"
                    >
                      <p className="text-sm font-medium text-gray-700">Incidencias abiertas</p>
                      <p className="text-xs text-gray-500">{pendientes.abiertas} pendientes</p>
                    </Link>
                    <Link
                      to="/incidencias"
                      onClick={() => setMenuPendientesOpen(false)}
                      className="block p-2 rounded hover:bg-gray-50"
                    >
                      <p className="text-sm font-medium text-gray-700">Incidencias en proceso</p>
                      <p className="text-xs text-gray-500">{pendientes.enProceso} en seguimiento</p>
                    </Link>
                    {canAccess('prefecto') && (
                      <Link
                        to="/seguimientos"
                        onClick={() => setMenuPendientesOpen(false)}
                        className="block p-2 rounded hover:bg-gray-50"
                      >
                        <p className="text-sm font-medium text-gray-700">Ir a Seguimientos</p>
                        <p className="text-xs text-gray-500">Captura acuerdos y evidencias</p>
                      </Link>
                    )}
                    <Link
                      to="/incidencias"
                      onClick={() => setMenuPendientesOpen(false)}
                      className="block p-2 rounded hover:bg-gray-50"
                    >
                      <p className="text-sm font-medium text-gray-700">Nueva incidencia / listado</p>
                      <p className="text-xs text-gray-500">Acceso directo a incidencias</p>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

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