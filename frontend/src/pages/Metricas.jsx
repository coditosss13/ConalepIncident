import { useState, useEffect, useMemo } from 'react'
import metricasApi from '../api/metricas.api'
import gruposApi from '../api/grupos.api'
import Alert from '../components/common/Alert'
import { Users, FileText, TrendingUp, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react'

function Metricas() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    grupo_id: '',
    severidad_id: ''
  })
  const [grupos, setGrupos] = useState([])

  const porSemestreConsolidado = useMemo(() => {
    const items = dashboard?.por_semestre || []
    const acumulado = new Map()

    items.forEach((item) => {
      const semestreNum = Number(item.semestre)
      if (!Number.isFinite(semestreNum)) return
      const actual = acumulado.get(semestreNum) || 0
      acumulado.set(semestreNum, actual + Number(item.total_incidencias || 0))
    })

    return Array.from(acumulado.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([semestre, total]) => ({
        semestre,
        total_incidencias: total
      }))
  }, [dashboard?.por_semestre])

  const severidades = [
    { id: 1, nombre: 'Leve' },
    { id: 2, nombre: 'Moderada' },
    { id: 3, nombre: 'Grave' }
  ]

  // Cargar grupos para el filtro
  useEffect(() => {
    const cargarGrupos = async () => {
      try {
        const res = await gruposApi.getAll()
        setGrupos(res.data)
      } catch (err) {
        console.error('Error al cargar grupos:', err)
      }
    }
    cargarGrupos()
  }, [])

  // Cargar dashboard
  useEffect(() => {
    const cargarDashboard = async () => {
      setLoading(true)
      setError('')
      try {
        const params = {}
        if (filtros.fechaInicio) params.fechaInicio = filtros.fechaInicio
        if (filtros.fechaFin) params.fechaFin = filtros.fechaFin
        if (filtros.grupo_id) params.grupo_id = filtros.grupo_id
        if (filtros.severidad_id) params.severidad_id = filtros.severidad_id

        const res = await metricasApi.getDashboard(params)
        setDashboard(res.data)
      } catch (err) {
        setError('Error al cargar las métricas')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    cargarDashboard()
  }, [filtros])

  const handleFiltroChange = (key, value) => {
    setFiltros(prev => ({ ...prev, [key]: value }))
  }

  const limpiarFiltros = () => {
    setFiltros({
      fechaInicio: '',
      fechaFin: '',
      grupo_id: '',
      severidad_id: ''
    })
  }

  if (loading && !dashboard) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-500">Cargando métricas...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Métricas y Estadísticas</h1>
        <p className="text-gray-500 mt-1">Panel de control de incidencias</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Filtros */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={20} className="text-primary" />
          <h2 className="font-semibold text-gray-700">Filtros</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="label">Fecha inicio</label>
            <input
              type="date"
              className="input"
              value={filtros.fechaInicio}
              onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Fecha fin</label>
            <input
              type="date"
              className="input"
              value={filtros.fechaFin}
              onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Grupo</label>
            <select
              className="input"
              value={filtros.grupo_id}
              onChange={(e) => handleFiltroChange('grupo_id', e.target.value)}
            >
              <option value="">Todos</option>
              {grupos.map(g => (
                <option key={g.id} value={g.id}>{g.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Severidad</label>
            <select
              className="input"
              value={filtros.severidad_id}
              onChange={(e) => handleFiltroChange('severidad_id', e.target.value)}
            >
              <option value="">Todas</option>
              {severidades.map(s => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={limpiarFiltros}
            className="text-sm text-primary hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Cards de resumen */}
      {dashboard && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Incidencias</p>
                  <p className="text-3xl font-bold mt-1">
                    {dashboard.resumen.total_incidencias}
                  </p>
                </div>
                <FileText size={40} className="text-blue-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Abiertas</p>
                  <p className="text-3xl font-bold mt-1">
                    {dashboard.resumen.incidencias_abiertas}
                  </p>
                </div>
                <AlertCircle size={40} className="text-red-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">En Proceso</p>
                  <p className="text-3xl font-bold mt-1">
                    {dashboard.resumen.incidencias_en_proceso}
                  </p>
                </div>
                <TrendingUp size={40} className="text-yellow-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Cerradas</p>
                  <p className="text-3xl font-bold mt-1">
                    {dashboard.resumen.incidencias_cerradas}
                  </p>
                  <p className="text-green-100 text-xs mt-1">
                    Tasa: {dashboard.resumen.tasa_cierre}
                  </p>
                </div>
                <CheckCircle size={40} className="text-green-200" />
              </div>
            </div>
          </div>

          {/* Incidencias por estado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FileText size={18} />
                Por Estado
              </h3>
              <div className="space-y-3">
                {dashboard.por_estado.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{item.estado}</span>
                      <span className="font-medium">{item.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.estado === 'abierta' ? 'bg-red-500' :
                          item.estado === 'en_proceso' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{
                          width: `${(item.total / dashboard.resumen.total_incidencias) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Por severidad */}
            <div className="card">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <AlertCircle size={18} />
                Por Severidad
              </h3>
              <div className="space-y-3">
                {dashboard.por_severidad.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.severidad?.nombre || 'Sin clasificar'}</span>
                      <span className="font-medium">{item.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          idx === 0 ? 'bg-green-500' :
                          idx === 1 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{
                          width: `${(item.total / dashboard.resumen.total_incidencias) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top alumnos y grupos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Users size={18} />
                Alumnos con más incidencias
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Alumno</th>
                      <th className="px-3 py-2 text-left">Matrícula</th>
                      <th className="px-3 py-2 text-right">Incidencias</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.alumnos_mas_incidencias.slice(0, 5).map((alumno, idx) => (
                      <tr key={alumno.id} className="border-t">
                        <td className="px-3 py-2">{alumno.nombre}</td>
                        <td className="px-3 py-2 text-gray-500">{alumno.matricula}</td>
                        <td className="px-3 py-2 text-right">
                          <span className="font-semibold text-red-600">
                            {alumno.total_incidencias}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FileText size={18} />
                Grupos con más incidencias
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Grupo</th>
                      <th className="px-3 py-2 text-left">Semestre</th>
                      <th className="px-3 py-2 text-right">Incidencias</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.grupos_mas_incidencias.slice(0, 5).map((grupo, idx) => (
                      <tr key={grupo.id} className="border-t">
                        <td className="px-3 py-2">{grupo.nombre}</td>
                        <td className="px-3 py-2 text-gray-500">{grupo.semestre}°</td>
                        <td className="px-3 py-2 text-right">
                          <span className="font-semibold text-red-600">
                            {grupo.total_incidencias}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Por semestre */}
          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-4">Incidencias por Semestre</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {porSemestreConsolidado.map((sem, idx) => (
                <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">
                    {sem.total_incidencias}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {sem.semestre}° semestre
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Metricas
