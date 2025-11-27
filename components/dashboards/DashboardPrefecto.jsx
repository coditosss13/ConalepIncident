"use client"

import { useEffect, useState } from "react"
import { getToken } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, FileText, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react"
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

export default function DashboardPrefecto() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPrefectoStats = async () => {
      try {
        const token = getToken()

        console.log("[v0] Obteniendo estadísticas de prefecto...")

        const res = await fetch(`${API_URL}/api/incidencias/stats/prefecto`, {
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
        console.error("[v0] Error al cargar estadísticas de prefecto:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadPrefectoStats()
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

  const totalIncidencias = (stats?.totalPendientes || 0) + (stats?.totalResueltas || 0)
  const noData = totalIncidencias === 0

  if (noData) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <Card className="bg-white border-2 border-dashed border-gray-300">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay incidencias para validar</h3>
            <p className="text-gray-500 mb-6">
              Aún no hay incidencias registradas en el sistema. Las estadísticas y casos pendientes de validación
              aparecerán aquí.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const tiposFrecuentesData = stats.incidenciasPorTipo || []

  const estadosData = [
    { name: "Pendientes", value: stats.totalPendientes || 0 },
    { name: "Resueltas", value: stats.totalResueltas || 0 },
  ]

  const COLORS_TIPOS = ["#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#14b8a6"]
  const COLORS_ESTADOS = ["#f59e0b", "#10b981"]

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
                <h2 className="text-lg font-medium opacity-90">Panel de Prefecto</h2>
                <p className="text-sm opacity-75">Seguimiento y validación</p>
                <div className="text-5xl font-bold mt-2">
                  {totalIncidencias} <span className="text-2xl font-normal">incidencias</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Clock className="h-6 w-6 mx-auto mb-2" />
                <div className="text-3xl font-bold">{stats.totalPendientes}</div>
                <p className="text-xs opacity-75 mt-1">Pendientes</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <CheckCircle className="h-6 w-6 mx-auto mb-2" />
                <div className="text-3xl font-bold">{stats.totalResueltas}</div>
                <p className="text-xs opacity-75 mt-1">Resueltas</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
                <div className="text-3xl font-bold">{stats.gravesPendientes}</div>
                <p className="text-xs opacity-75 mt-1">Graves</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficas principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tipos Más Frecuentes */}
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Incidencias Más Frecuentes</CardTitle>
          </CardHeader>
          <CardContent>
            {tiposFrecuentesData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No hay datos disponibles</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tiposFrecuentesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tiposFrecuentesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_TIPOS[index % COLORS_TIPOS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Estado de Incidencias */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Incidencias</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={estadosData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {estadosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_ESTADOS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Comparativa por Periodo Escolar */}
      <Card>
        <CardHeader>
          <CardTitle>Comparativa por Período Escolar</CardTitle>
        </CardHeader>
        <CardContent>
          {!stats.tendenciasPorMes || stats.tendenciasPorMes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No hay datos de tendencias</p>
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
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Incidencias Recientes (Tabla) */}
      <Card>
        <CardHeader>
          <CardTitle>Incidencias Recientes (Pendientes de Validación)</CardTitle>
        </CardHeader>
        <CardContent>
          {!stats.ultimasPendientes || stats.ultimasPendientes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No hay incidencias pendientes de validación</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.ultimasPendientes.map((incidencia, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm"
                >
                  <div className="flex-1">
                    <p className="font-medium">{incidencia.alumno}</p>
                    <p className="text-xs text-gray-600">
                      {incidencia.tipo} - <span className="font-semibold">{incidencia.gravedad}</span>
                    </p>
                    <p className="text-xs text-gray-400">Registrado por: {incidencia.docente}</p>
                    <p className="text-xs text-gray-400">{new Date(incidencia.fecha).toLocaleString()}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pendiente
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
