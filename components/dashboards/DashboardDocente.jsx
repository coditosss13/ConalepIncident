"use client"

import { useEffect, useState } from "react"
import { getToken } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, FileText, TrendingUp, AlertCircle, Users } from "lucide-react"
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
} from "recharts"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export default function DashboardDocente() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDocenteStats = async () => {
      try {
        const token = getToken()
        const userStr = localStorage.getItem("user")
        const userData = userStr ? JSON.parse(userStr) : {}

        console.log("[v0] Usuario docente obtenido:", userData)

        if (!userData.id_usuario) {
          throw new Error("No se encontró el ID de usuario")
        }

        const res = await fetch(`${API_URL}/api/incidencias/stats/docente/${userData.id_usuario}`, {
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
        console.error("[v0] Error al cargar estadísticas de docente:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadDocenteStats()
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
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No has registrado incidencias</h3>
            <p className="text-gray-500 mb-6">
              Aún no has registrado ninguna incidencia. Las estadísticas de tus grupos aparecerán aquí una vez que
              registres casos.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const tiposComunesData =
    stats.tiposComunes?.map((item) => ({
      name: item.tipo,
      value: Number.parseInt(item.cantidad),
    })) || []

  const COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#14b8a6"]

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Card Principal */}
      <Card className="bg-gradient-to-r from-[#0c6857] to-[#0a5345] text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-lg">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-lg font-medium opacity-90">Panel de Docente</h2>
                <p className="text-sm opacity-75">Mis grupos asignados</p>
                <div className="text-5xl font-bold mt-2">
                  {stats.totalIncidencias} <span className="text-2xl font-normal">registradas</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
                <div className="text-3xl font-bold">{stats.incidenciasGraves}</div>
                <p className="text-xs opacity-75 mt-1">Graves</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                <div className="text-3xl font-bold">{stats.incidenciasPendientes}</div>
                <p className="text-xs opacity-75 mt-1">Pendientes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficas principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tipos de Incidencias Más Comunes */}
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Incidencias Más Comunes</CardTitle>
          </CardHeader>
          <CardContent>
            {tiposComunesData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No hay datos disponibles</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tiposComunesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tiposComunesData.map((entry, index) => (
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

        {/* Ranking de Alumnos (Solo Mis Grupos) */}
        <Card>
          <CardHeader>
            <CardTitle>Alumnos con Más Incidencias</CardTitle>
          </CardHeader>
          <CardContent>
            {!stats.alumnosConMasIncidencias || stats.alumnosConMasIncidencias.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No hay datos de alumnos</p>
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
                    <span className="text-2xl font-bold text-[#0c6857]">{alumno.total_incidencias}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tendencia por Semana/Mes */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Incidencias por Semana/Mes</CardTitle>
        </CardHeader>
        <CardContent>
          {!stats.tendenciasSemana || stats.tendenciasSemana.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No hay datos de tendencias</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.tendenciasSemana}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="semana" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#0c6857"
                  strokeWidth={2}
                  name="Incidencias"
                  dot={{ fill: "#0c6857", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Resumen por Alumno (Últimos Registros) */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen por Alumno (Últimos Registros)</CardTitle>
        </CardHeader>
        <CardContent>
          {!stats.ultimosRegistros || stats.ultimosRegistros.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No hay registros recientes</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.ultimosRegistros.map((registro, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                  <div className="flex-1">
                    <p className="font-medium">{registro.alumno}</p>
                    <p className="text-xs text-gray-600">
                      {registro.tipo} - <span className="font-semibold">{registro.gravedad}</span>
                    </p>
                    <p className="text-xs text-gray-400">{new Date(registro.fecha).toLocaleString()}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      registro.estado === "Pendiente" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {registro.estado}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
