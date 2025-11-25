"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { getToken, getIncidencias } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function AlumnoHistorialPage() {
  const router = useRouter()
  const params = useParams()
  const alumnoId = params.id
  const [incidencias, setIncidencias] = useState([])
  const [alumnoData, setAlumnoData] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    disciplina: 0,
    uniforme: 0,
    violencia: 0,
    academico: 0,
    asistencia: 0,
    leves: 0,
    moderadas: 0,
    graves: 0,
    primeraVez: 0,
    reincidencia: 0,
    casoCritico: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push("/login")
      return
    }

    const loadAlumnoData = async () => {
      try {
        const allIncidencias = await getIncidencias(token)
        const alumnoIncidencias = allIncidencias.filter((inc) => inc.id_alumno?.toString() === alumnoId)

        setIncidencias(alumnoIncidencias)

        if (alumnoIncidencias.length > 0) {
          setAlumnoData({
            nombre: alumnoIncidencias[0].nombre_alumno || "Alumno",
            matricula: alumnoIncidencias[0].matricula || "N/A",
            grupo: alumnoIncidencias[0].grupo || "N/A",
          })
        }

        const primeraVezCount = alumnoIncidencias.length === 1 ? 1 : 0
        const reincidenciaCount =
          alumnoIncidencias.length > 1 && alumnoIncidencias.length < 5 ? alumnoIncidencias.length - 1 : 0
        const casoCriticoCount = alumnoIncidencias.length >= 5 ? alumnoIncidencias.length : 0

        setStats({
          total: alumnoIncidencias.length,
          disciplina: alumnoIncidencias.filter((i) => i.tipo_incidencia === "Disciplina").length,
          uniforme: alumnoIncidencias.filter((i) => i.tipo_incidencia === "Uniforme").length,
          violencia: alumnoIncidencias.filter((i) => i.tipo_incidencia === "Violencia").length,
          academico: alumnoIncidencias.filter((i) => i.tipo_incidencia === "Académico").length,
          asistencia: alumnoIncidencias.filter((i) => i.tipo_incidencia === "Asistencia").length,
          leves: alumnoIncidencias.filter((i) => i.gravedad === "Leve").length,
          moderadas: alumnoIncidencias.filter((i) => i.gravedad === "Moderada").length,
          graves: alumnoIncidencias.filter((i) => i.gravedad === "Grave").length,
          primeraVez: primeraVezCount,
          reincidencia: reincidenciaCount,
          casoCritico: casoCriticoCount,
        })
      } catch (error) {
        console.error("Error al cargar datos del alumno:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAlumnoData()
  }, [router, alumnoId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Cargando historial...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0c6857] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/alumnos">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Historial del Alumno</h1>
              <p className="text-sm text-white/80">{alumnoData?.nombre}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Alumno
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nombre</p>
              <p className="font-semibold">{alumnoData?.nombre}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Matrícula</p>
              <p className="font-semibold">{alumnoData?.matricula}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Grupo</p>
              <p className="font-semibold">{alumnoData?.grupo}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Incidencias</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Disciplina</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{stats.disciplina}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Uniforme</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">{stats.uniforme}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Académico</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{stats.academico}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Asistencia</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">{stats.asistencia}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas por Gravedad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.leves}</p>
                  <p className="text-sm text-gray-600">Leves</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{stats.moderadas}</p>
                  <p className="text-sm text-gray-600">Moderadas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{stats.graves}</p>
                  <p className="text-sm text-gray-600">Graves</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Frecuencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats.primeraVez}</p>
                  <p className="text-sm text-gray-600">Primera Vez</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{stats.reincidencia}</p>
                  <p className="text-sm text-gray-600">Reincidencia</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{stats.casoCritico}</p>
                  <p className="text-sm text-gray-600">Caso Crítico</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Acciones Correctivas Aplicadas</CardTitle>
            <CardDescription>Seguimiento a medidas disciplinarias</CardDescription>
          </CardHeader>
          <CardContent>
            {incidencias.filter((inc) => inc.accion_correctiva).length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay acciones correctivas registradas</p>
            ) : (
              <div className="space-y-3">
                {incidencias
                  .filter((inc) => inc.accion_correctiva)
                  .map((inc) => (
                    <div key={inc.id_incidencia} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded">
                      <p className="font-semibold text-sm">{inc.accion_correctiva}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Fecha: {new Date(inc.fecha_accion).toLocaleDateString("es-MX")}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial Cronológico</CardTitle>
            <CardDescription>Todas las incidencias registradas</CardDescription>
          </CardHeader>
          <CardContent>
            {incidencias.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay incidencias registradas</p>
            ) : (
              <div className="space-y-4">
                {incidencias
                  .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                  .map((inc) => (
                    <div key={inc.id_incidencia} className="border-l-4 border-[#0c6857] pl-4 py-2">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline">{inc.tipo_incidencia}</Badge>
                        <Badge>{inc.gravedad}</Badge>
                        <Badge variant="secondary">{inc.estado}</Badge>
                      </div>
                      <p className="text-sm mb-1">{inc.observaciones}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Registrado por: {inc.usuario}</span>
                        <span>{new Date(inc.fecha).toLocaleDateString("es-MX")}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
