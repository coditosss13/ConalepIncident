"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle } from "lucide-react"

export default function ValidacionPage() {
  const [incidenciasPendientes, setIncidenciasPendientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [validando, setValidando] = useState(null)
  const [observaciones, setObservaciones] = useState("")

  useEffect(() => {
    fetchIncidenciasPendientes()
  }, [])

  const fetchIncidenciasPendientes = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/incidencias/pendientes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setIncidenciasPendientes(data)
      }
    } catch (error) {
      console.error("Error al cargar incidencias pendientes:", error)
    } finally {
      setLoading(false)
    }
  }

  const validarIncidencia = async (idIncidencia, aprobada) => {
    try {
      setValidando(idIncidencia)
      const token = localStorage.getItem("token")

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/incidencias/${idIncidencia}/validar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          aprobada,
          observaciones,
        }),
      })

      if (response.ok) {
        await fetchIncidenciasPendientes()
        setObservaciones("")
      }
    } catch (error) {
      console.error("Error al validar incidencia:", error)
    } finally {
      setValidando(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0c6857]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Validar Incidencias</h1>
        <p className="text-gray-500 mt-1">Revisa y valida las incidencias registradas</p>
      </div>

      <div className="grid gap-6">
        {incidenciasPendientes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              No hay incidencias pendientes de validación
            </CardContent>
          </Card>
        ) : (
          incidenciasPendientes.map((incidencia) => (
            <Card key={incidencia.id_incidencia}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Incidencia #{incidencia.id_incidencia}</CardTitle>
                  <Badge className="bg-yellow-100 text-yellow-800">Pendiente de Validación</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Alumno</p>
                    <p className="font-medium">{incidencia.alumno}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-medium">{new Date(incidencia.fecha).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tipo</p>
                    <Badge variant="outline">{incidencia.tipo_incidencia}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gravedad</p>
                    <Badge
                      className={
                        incidencia.gravedad === "Grave" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {incidencia.gravedad}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Observaciones del Docente</p>
                  <p className="mt-1">{incidencia.observaciones}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Observaciones de Validación</label>
                  <Textarea
                    placeholder="Agregar observaciones..."
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => validarIncidencia(incidencia.id_incidencia, true)}
                    disabled={validando === incidencia.id_incidencia}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprobar
                  </Button>
                  <Button
                    onClick={() => validarIncidencia(incidencia.id_incidencia, false)}
                    disabled={validando === incidencia.id_incidencia}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rechazar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
