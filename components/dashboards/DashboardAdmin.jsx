"use client"

import { useEffect, useState } from "react"
import { getToken } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, FileText, CheckCircle, Users, AlertCircle } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export default function DashboardAdmin() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadAdminStats = async () => {
      try {
        const token = getToken()

        console.log("[v0] Obteniendo estadísticas de administrador...")

        const res = await fetch(`${API_URL}/api/incidencias/stats/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`)
        }

        const data = await res.json()
        console.log("[v0] Datos recibidos del backend:", data)

        if (data.ok && data.stats) {
          setStats(data.stats)
        } else {
          throw new Error("Respuesta inválida del servidor")
        }
      } catch (error) {
        console.error("[v0] Error al cargar estadísticas de administrador:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadAdminStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0c6857] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <Card className="bg-red-50 border-2 border-red-200">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-700 mb-2">Error al cargar datos</h3>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const noData = !stats || stats.totalIncidencias === 0

  if (noData) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <Card className="bg-white border-2 border-dashed border-gray-300">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay incidencias registradas</h3>
            <p className="text-gray-500 mb-6">
              Aún no se han registrado incidencias en el sistema. Las estadísticas aparecerán aquí una vez que se
              registren casos.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const incidenciasPorTipoData =
    stats.incidenciasPorTipo?.map((item) => ({
      name: item.tipo,
      value: Number.parseInt(item.cantidad),
    })) || []

  const incidenciasPorGravedadData =
    stats.incidenciasPorGravedad?.map((item) => ({
      name: item.gravedad,
      value: Number.parseInt(item.cantidad),
    })) || []

  const pendientes = stats.incidenciasPorEstado?.find((e) => e.estado === "Pendiente")?.cantidad || 0
  const resueltas = stats.incidenciasPorEstado?.find((e) => e.estado === "Resuelta")?.cantidad || 0
  const graves = incidenciasPorGravedadData.find((g) => g.name === "Grave")?.value || 0

  const COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#14b8a6", "#ec4899"]

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Card Principal con Indicadores */}
      <Card className="bg-gradient-to-r from-[#0c6857] to-[#0a5345] text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-lg">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-lg font-medium opacity-90">Panel de Administrador</h2>
                <p className="text-sm opacity-75">Estadísticas globales del sistema</p>
                <div className="text-5xl font-bold mt-2">
                  {stats.totalIncidencias} <span className="text-2xl font-normal">incidencias</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
                <div className="text-3xl font-bold">{pendientes}</div>
                <p className="text-xs opacity-75 mt-1">Pendientes</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <CheckCircle className="h-6 w-6 mx-auto mb-2" />
                <div className="text-3xl font-bold">{resueltas}</div>
                <p className="text-xs opacity-75 mt-1">Resueltas</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                <div className="text-3xl font-bold">{graves}</div>
                <p className="text-xs opacity-75 mt-1">Graves</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficas principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Incidencias por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            {incidenciasPorTipoData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-center text-gray-500">
                <p>No hay incidencias registradas para mostrar la distribución.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incidenciasPorTipoData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incidenciasPorTipoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alumnos con Más Incidencias</CardTitle>
          </CardHeader>
          <CardContent>
            {!stats.alumnosConMasIncidencias || stats.alumnosConMasIncidencias.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-center text-gray-500">
                <p>Aún no hay alumnos con incidencias registradas.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.alumnosConMasIncidencias.map((alumno, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0c6857] text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium text-sm">{alumno.nombre_completo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-[#0c6857]">{alumno.total_incidencias}</span>
                      <span className="text-xs text-gray-500">casos</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tendencias por Período Escolar</CardTitle>
        </CardHeader>
        <CardContent>
          {!stats.tendenciasPorMes || stats.tendenciasPorMes.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-center text-gray-500">
              <p>No hay datos de incidencias para este periodo escolar.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.tendenciasPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  name="Total"
                  dot={{ fill: "#14b8a6", r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="criticas"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Críticas"
                  dot={{ fill: "#ef4444", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Ranking de Grupos e Actividad de Usuarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ranking de Grupos con Más Incidencias */}
        <Card>
          <CardHeader>
            <CardTitle>Incidencias por Grupo</CardTitle>
          </CardHeader>
          <CardContent>
            {!stats.incidenciasPorGrupo || stats.incidenciasPorGrupo.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No hay datos de grupos</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.incidenciasPorGrupo}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grupo" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total_incidencias" fill="#0c6857" name="Incidencias" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Actividad de Usuarios (Bitácora) */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            {!stats.actividadUsuarios || stats.actividadUsuarios.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No hay actividad reciente</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {stats.actividadUsuarios.map((actividad, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg text-xs">
                    <Users className="h-4 w-4 text-[#0c6857] flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{actividad.usuario}</p>
                      <p className="text-gray-600 truncate">{actividad.accion}</p>
                      <p className="text-gray-400">{new Date(actividad.fecha).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
