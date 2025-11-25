"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getToken, getIncidencias } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, FileText } from "lucide-react"
import Link from "next/link"

export default function ReportesPage() {
  const router = useRouter()
  const [incidencias, setIncidencias] = useState([])
  const [tipoReporte, setTipoReporte] = useState("general")
  const [periodo, setPeriodo] = useState("mes")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push("/login")
      return
    }

    const loadIncidencias = async () => {
      try {
        const data = await getIncidencias(token)
        setIncidencias(data)
      } catch (error) {
        console.error("Error al cargar incidencias:", error)
      } finally {
        setLoading(false)
      }
    }

    loadIncidencias()
  }, [router])

  const handleExportPDF = () => {
    alert("Exportar a PDF - Funcionalidad próximamente")
  }

  const handleExportExcel = () => {
    alert("Exportar a Excel - Funcionalidad próximamente")
  }

  const getReporteData = () => {
    const now = new Date()
    let filtered = incidencias

    // Filtrar por periodo
    if (periodo === "semana") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filtered = incidencias.filter((i) => new Date(i.fecha) >= weekAgo)
    } else if (periodo === "mes") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      filtered = incidencias.filter((i) => new Date(i.fecha) >= monthAgo)
    } else if (periodo === "trimestre") {
      const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      filtered = incidencias.filter((i) => new Date(i.fecha) >= quarterAgo)
    }

    return {
      total: filtered.length,
      academicas: filtered.filter((i) => i.categoria === "Académica").length,
      disciplinarias: filtered.filter((i) => i.categoria === "Disciplinaria").length,
      asistencia: filtered.filter((i) => i.categoria === "Asistencia").length,
      leves: filtered.filter((i) => i.gravedad === "Leve").length,
      moderadas: filtered.filter((i) => i.gravedad === "Moderada").length,
      graves: filtered.filter((i) => i.gravedad === "Grave").length,
      pendientes: filtered.filter((i) => i.estado === "Pendiente").length,
      resueltas: filtered.filter((i) => i.estado === "Resuelta").length,
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Cargando reportes...</p>
      </div>
    )
  }

  const reporteData = getReporteData()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0c6857] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Reportes</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tipo de Reporte</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={tipoReporte} onValueChange={setTipoReporte}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="por-alumno">Por Alumno</SelectItem>
                  <SelectItem value="por-grupo">Por Grupo</SelectItem>
                  <SelectItem value="por-docente">Por Docente</SelectItem>
                  <SelectItem value="por-tipo">Por Tipo</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Periodo</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semana">Última Semana</SelectItem>
                  <SelectItem value="mes">Último Mes</SelectItem>
                  <SelectItem value="trimestre">Último Trimestre</SelectItem>
                  <SelectItem value="anio">Año Actual</SelectItem>
                  <SelectItem value="todo">Todo</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Exportar</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button onClick={handleExportPDF} variant="outline" className="flex-1 bg-transparent">
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button onClick={handleExportExcel} variant="outline" className="flex-1 bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Excel
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resumen de Incidencias - {periodo}</CardTitle>
            <CardDescription>Estadísticas del periodo seleccionado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-sm text-gray-600">Total</h3>
                <p className="text-3xl font-bold text-[#0c6857]">{reporteData.total}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-sm text-gray-600">Por Tipo</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Académicas:</span>
                    <span className="font-semibold">{reporteData.academicas}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Disciplinarias:</span>
                    <span className="font-semibold">{reporteData.disciplinarias}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Asistencia:</span>
                    <span className="font-semibold">{reporteData.asistencia}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-sm text-gray-600">Por Gravedad</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Leves:</span>
                    <span className="font-semibold text-green-600">{reporteData.leves}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Moderadas:</span>
                    <span className="font-semibold text-yellow-600">{reporteData.moderadas}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Graves:</span>
                    <span className="font-semibold text-red-600">{reporteData.graves}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-sm text-gray-600">Por Estado</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pendientes:</span>
                    <span className="font-semibold text-yellow-600">{reporteData.pendientes}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Resueltas:</span>
                    <span className="font-semibold text-green-600">{reporteData.resueltas}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Gráficas de Comportamiento</CardTitle>
            <CardDescription>Visualización de tendencias institucionales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">Gráficas próximamente (Chart.js / Recharts)</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
