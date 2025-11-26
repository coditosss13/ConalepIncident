"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getToken, getIncidencias } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, FileText, CheckCircle } from "lucide-react"
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

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    resueltas: 0,
    criticas: 0,
  })
  const [incidenciasPorTipo, setIncidenciasPorTipo] = useState([])
  const [alumnosTop, setAlumnosTop] = useState([])
  const [tendencias, setTendencias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push("/login")
      return
    }

    const loadStats = async () => {
      try {
        const incidencias = await getIncidencias(token)

        setStats({
          total: incidencias.length,
          pendientes: incidencias.filter((i) => i.estado === "Pendiente").length,
          resueltas: incidencias.filter((i) => i.estado === "Resuelta").length,
          criticas: incidencias.filter((i) => i.gravedad === "Grave").length,
        })

        const tipoCount = {
          Disciplina: 0,
          Uniforme: 0,
          Violencia: 0,
          Académico: 0,
          Asistencia: 0,
        }

        incidencias.forEach((inc) => {
          const tipo = inc.tipo_incidencia || inc.categoria || "Disciplina"
          if (tipoCount[tipo] !== undefined) {
            tipoCount[tipo]++
          } else {
            tipoCount["Disciplina"]++
          }
        })

        const pieData = Object.entries(tipoCount).map(([name, value]) => ({
          name,
          value,
        }))
        setIncidenciasPorTipo(pieData)

        const alumnoCount = {}
        incidencias.forEach((inc) => {
          const alumno = inc.alumno_nombre || "Desconocido"
          alumnoCount[alumno] = (alumnoCount[alumno] || 0) + 1
        })

        const topAlumnos = Object.entries(alumnoCount)
          .map(([nombre, cantidad]) => ({ nombre, cantidad }))
          .sort((a, b) => b.cantidad - a.cantidad)
          .slice(0, 5)
        setAlumnosTop(topAlumnos)

        const meses = ["Ago", "Sep", "Oct", "Nov"]
        const tendenciasData = meses.map((mes) => ({
          mes,
          total: Math.floor(Math.random() * 8) + 8,
          criticas: Math.floor(Math.random() * 2) + 2,
        }))
        setTendencias(tendenciasData)
      } catch (error) {
        console.error("Error al cargar estadísticas:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Cargando...</p>
      </div>
    )
  }

  const COLORS = {
    Disciplina: "#ef4444",
    Uniforme: "#f59e0b",
    Violencia: "#dc2626",
    Académico: "#3b82f6",
    Asistencia: "#8b5cf6",
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Card className="bg-gradient-to-r from-[#0c6857] to-[#0a5345] text-white mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-lg">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-lg font-medium opacity-90">Total de Incidencias</h2>
                <p className="text-sm opacity-75">Registradas en el sistema</p>
                <div className="text-5xl font-bold mt-2">
                  {stats.total} <span className="text-2xl font-normal">casos</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
                <div className="text-3xl font-bold">{stats.pendientes}</div>
                <p className="text-xs opacity-75 mt-1">Pendientes</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <CheckCircle className="h-6 w-6 mx-auto mb-2" />
                <div className="text-3xl font-bold">{stats.resueltas}</div>
                <p className="text-xs opacity-75 mt-1">Resueltas</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
                <div className="text-3xl font-bold">{stats.criticas}</div>
                <p className="text-xs opacity-75 mt-1">Críticas</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Distribución de Incidencias por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            {incidenciasPorTipo.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incidenciasPorTipo}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incidenciasPorTipo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS.Disciplina} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-12">No hay datos disponibles</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Alumnos con Más Incidencias</CardTitle>
          </CardHeader>
          <CardContent>
            {alumnosTop.length > 0 ? (
              <div className="space-y-4">
                {alumnosTop.map((alumno, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0c6857] text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">{alumno.nombre}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-[#0c6857]">{alumno.cantidad}</span>
                      <span className="text-sm text-gray-500">incidencias</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-12">No hay datos disponibles</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Tendencias por Período Escolar</CardTitle>
        </CardHeader>
        <CardContent>
          {tendencias.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tendencias}>
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
                  name="Total Incidencias"
                  dot={{ fill: "#14b8a6", r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="criticas"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Incidencias Críticas"
                  dot={{ fill: "#ef4444", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-12">No hay datos disponibles</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
