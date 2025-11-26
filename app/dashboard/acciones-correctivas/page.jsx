"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getToken, getUserData } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ROLES } from "@/lib/permissions"
import { AlertCircle } from "lucide-react"

export default function AccionesCorrectivasPage() {
  const router = useRouter()
  const [incidencias, setIncidencias] = useState([])
  const [selectedIncidencia, setSelectedIncidencia] = useState(null)
  const [accionCorrectiva, setAccionCorrectiva] = useState({
    descripcion: "",
    fechaAplicacion: new Date().toISOString().split("T")[0],
  })
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const userData = getUserData()
    const userObj = JSON.parse(localStorage.getItem("user"))
    setUserRole(userObj?.id_rol)

    // Solo Coordinador y Admin pueden acceder
    if (userObj?.id_rol !== ROLES.ADMIN && userObj?.id_rol !== ROLES.COORDINADOR) {
      router.push("/dashboard")
      return
    }

    loadIncidenciasPendientes()
  }, [router])

  const loadIncidenciasPendientes = async () => {
    try {
      const token = getToken()
      // Cargar incidencias que requieren acción correctiva
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/incidencias?estado=Pendiente`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setIncidencias(data)
    } catch (error) {
      console.error("Error al cargar incidencias:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = getToken()
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/acciones-correctivas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_incidencia: selectedIncidencia,
          ...accionCorrectiva,
        }),
      })

      alert("Acción correctiva registrada exitosamente")
      loadIncidenciasPendientes()
      setAccionCorrectiva({ descripcion: "", fechaAplicacion: new Date().toISOString().split("T")[0] })
      setSelectedIncidencia(null)
    } catch (error) {
      console.error("Error al registrar acción correctiva:", error)
      alert("Error al registrar acción correctiva")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Aplicar Acciones Correctivas</CardTitle>
          <p className="text-sm text-gray-600">Registre las medidas correctivas aplicadas a las incidencias</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="incidencia">Incidencia *</Label>
              <Select value={selectedIncidencia} onValueChange={setSelectedIncidencia} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una incidencia" />
                </SelectTrigger>
                <SelectContent>
                  {incidencias.map((inc) => (
                    <SelectItem key={inc.id_incidencia} value={inc.id_incidencia}>
                      #{inc.id_incidencia} - {inc.nombre_alumno} - {inc.tipo_incidencia} ({inc.gravedad})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción de la Acción Correctiva *</Label>
              <Textarea
                id="descripcion"
                placeholder="Describa la medida correctiva aplicada..."
                value={accionCorrectiva.descripcion}
                onChange={(e) => setAccionCorrectiva({ ...accionCorrectiva, descripcion: e.target.value })}
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaAplicacion">Fecha de Aplicación *</Label>
              <Input
                id="fechaAplicacion"
                type="date"
                value={accionCorrectiva.fechaAplicacion}
                onChange={(e) => setAccionCorrectiva({ ...accionCorrectiva, fechaAplicacion: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-[#0c6857] hover:bg-[#0a5345]" disabled={loading}>
              {loading ? "Guardando..." : "Registrar Acción Correctiva"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Incidencias Pendientes de Atención</CardTitle>
        </CardHeader>
        <CardContent>
          {incidencias.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay incidencias pendientes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incidencias.map((inc) => (
                <div key={inc.id_incidencia} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">
                        {inc.nombre_alumno} - {inc.tipo_incidencia}
                      </p>
                      <p className="text-sm text-gray-600">{inc.observaciones}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">{inc.gravedad}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{inc.estado}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setSelectedIncidencia(inc.id_incidencia)}
                      className="bg-[#0c6857] hover:bg-[#0a5345]"
                    >
                      Aplicar Acción
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
