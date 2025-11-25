"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { getToken, getIncidenciaById } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Users, ImageIcon } from "lucide-react"
import Link from "next/link"

export default function IncidenciaDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [incidencia, setIncidencia] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push("/login")
      return
    }

    const loadIncidencia = async () => {
      try {
        const data = await getIncidenciaById(params.id, token)
        setIncidencia(data)
      } catch (error) {
        console.error("Error al cargar incidencia:", error)
      } finally {
        setLoading(false)
      }
    }

    loadIncidencia()
  }, [router, params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Cargando...</p>
      </div>
    )
  }

  if (!incidencia) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Incidencia no encontrada</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0c6857] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/incidencias">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Detalle de Incidencia #{incidencia.id_incidencia}</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">Información General</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={incidencia.gravedad === "Alta" ? "destructive" : "default"}>
                      {incidencia.gravedad}
                    </Badge>
                    <Badge variant="outline">{incidencia.estado}</Badge>
                    {incidencia.tipo_incidencia && <Badge>{incidencia.tipo_incidencia}</Badge>}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Observaciones
                </h3>
                <p className="text-gray-700">{incidencia.observaciones}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">Registrado por</p>
                  <p className="font-medium">{incidencia.usuario}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-medium">{new Date(incidencia.fecha).toLocaleDateString("es-MX")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {incidencia.alumnos && incidencia.alumnos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Alumnos Involucrados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {incidencia.alumnos.map((alumno, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium">{alumno.nombre}</p>
                      {alumno.observacion && <p className="text-sm text-gray-600 mt-1">{alumno.observacion}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {incidencia.evidencias && incidencia.evidencias.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Evidencias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {incidencia.evidencias.map((evidencia, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <p className="text-sm font-medium truncate">{evidencia.archivo}</p>
                      <p className="text-xs text-gray-500">{evidencia.tipoarchivo}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(evidencia.fechasubida).toLocaleDateString("es-MX")}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
