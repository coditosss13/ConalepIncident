import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { FileText, Users, GraduationCap, Layers, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import incidenciasApi from '../api/incidencias.api'
import alumnosApi from '../api/alumnos.api'
import gruposApi from '../api/grupos.api'

function Dashboard() {
  const { user, canAccess } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [alumnosCount, setAlumnosCount] = useState(0)
  const [gruposCount, setGruposCount] = useState(0)
  const [actividadReciente, setActividadReciente] = useState([])

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      try {
        // Cargar estadísticas de incidencias para todos los roles
        const [incidenciasActivasRes, incidenciasCerradasRes] = await Promise.all([
          incidenciasApi.getAll({ page: 1, limit: 200 }),
          incidenciasApi.getAll({ page: 1, limit: 200, estado: 'cerrada' })
        ])

        const incidenciasActivas = incidenciasActivasRes.data || []
        const incidenciasCerradas = incidenciasCerradasRes.data || []
        const incidencias = [...incidenciasActivas, ...incidenciasCerradas]
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

        setActividadReciente(incidencias.slice(0, 5))
        const porEstadoMap = incidencias.reduce((acc, incidencia) => {
          acc[incidencia.estado] = (acc[incidencia.estado] || 0) + 1
          return acc
        }, {})
        const porSeveridadMap = incidencias.reduce((acc, incidencia) => {
          const key = incidencia.severidad?.nombre || 'Sin clasificar'
          acc[key] = (acc[key] || 0) + 1
          return acc
        }, {})

        setStats({
          porEstado: Object.entries(porEstadoMap).map(([estado, total]) => ({ estado, total })),
          porSeveridad: Object.entries(porSeveridadMap).map(([severidad, total]) => ({ severidad, total }))
        })

        // Cargar conteo de alumnos
        if (canAccess('prefecto')) {
          const alumnosRes = await alumnosApi.getAll({ limit: 1 })
          setAlumnosCount(alumnosRes.pagination?.total || 0)
        }

        // Cargar conteo de grupos
        if (canAccess('prefecto')) {
          const gruposRes = await gruposApi.getAll({ limit: 1 })
          setGruposCount(gruposRes.pagination?.total || 0)
        }
      } catch (err) {
        console.error('Error al cargar estadísticas:', err)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  // Calcular totales por estado
  const getTotalPorEstado = (estado) => {
    if (!stats?.porEstado) return 0
    const item = stats.porEstado.find(e => e.estado === estado)
    return item ? parseInt(item.total || 0) : 0
  }

  // Tarjetas de estadísticas
  const statsCards = [
    {
      title: 'Total Incidencias',
      value: stats?.porEstado?.reduce((acc, e) => acc + parseInt(e.total || 0), 0) || 0,
      icon: FileText,
      color: 'bg-blue-500',
      roles: ['profesor', 'prefecto', 'administrador']
    },
    {
      title: 'Incidencias Abiertas',
      value: getTotalPorEstado('abierta'),
      icon: AlertCircle,
      color: 'bg-yellow-500',
      roles: ['profesor', 'prefecto', 'administrador']
    },
    {
      title: 'En Proceso',
      value: getTotalPorEstado('en_proceso'),
      icon: Clock,
      color: 'bg-orange-500',
      roles: ['profesor', 'prefecto', 'administrador']
    },
    {
      title: 'Cerradas',
      value: getTotalPorEstado('cerrada'),
      icon: CheckCircle,
      color: 'bg-green-500',
      roles: ['profesor', 'prefecto', 'administrador']
    },
    {
      title: 'Alumnos Registrados',
      value: alumnosCount,
      icon: GraduationCap,
      color: 'bg-green-500',
      roles: ['prefecto', 'administrador']
    },
    {
      title: 'Grupos Activos',
      value: gruposCount,
      icon: Layers,
      color: 'bg-purple-500',
      roles: ['prefecto', 'administrador']
    }
  ]

  // Filtrar cards según rol
  const visibleCards = statsCards.filter(card => card.roles.includes(user?.rol?.nombre))

  // Acciones rápidas según rol
  const quickActions = [
    {
      title: 'Nueva Incidencia',
      description: 'Registrar una nueva incidencia',
      path: '/incidencias',
      roles: ['profesor', 'prefecto', 'administrador']
    },
    {
      title: 'Ver Incidencias',
      description: 'Listado completo de incidencias',
      path: '/incidencias',
      roles: ['profesor', 'prefecto', 'administrador']
    },
    {
      title: 'Alumnos',
      description: 'Gestionar alumnos',
      path: '/alumnos',
      roles: ['prefecto', 'administrador']
    },
    {
      title: 'Grupos',
      description: 'Gestionar grupos',
      path: '/grupos',
      roles: ['prefecto', 'administrador']
    },
    {
      title: 'Usuarios',
      description: 'Administrar usuarios del sistema',
      path: '/usuarios',
      roles: ['administrador']
    }
  ]

  const visibleActions = quickActions.filter(action => action.roles.includes(user?.rol?.nombre))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Resumen general del sistema de incidencias
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Cargando estadísticas...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleCards.map((card, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
                  </div>
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <card.icon size={24} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {visibleActions.map((action, index) => (
                <a
                  key={index}
                  href={action.path}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-50 transition-all group"
                >
                  <h3 className="font-medium text-gray-800 group-hover:text-primary">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Por Severidad */}
          {(user?.rol?.nombre === 'administrador' || user?.rol?.nombre === 'prefecto') && stats?.porSeveridad && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Incidencias por Severidad</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.porSeveridad.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{item.severidad}</span>
                      <span className="text-2xl font-bold text-gray-800">
                        {item.total || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h2>
            {actividadReciente.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <TrendingUp size={48} className="mx-auto mb-3 opacity-50" />
                <p>Las incidencias aparecerán aquí cuando se registren</p>
              </div>
            ) : (
              <div className="space-y-2">
                {actividadReciente.map((incidencia) => (
                  <div key={incidencia.id} className="border rounded p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">#{incidencia.id} - {incidencia.titulo}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(incidencia.fecha).toLocaleString('es-MX')} - {incidencia.grupo?.nombre || 'Sin grupo'}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 capitalize">{incidencia.estado}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard