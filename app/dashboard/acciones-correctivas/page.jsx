"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  getToken,
  getUserData,
  aplicarAccionCorrectiva,
  getAccionesCorrectivas,
  getIncidenciasPendientes,
} from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function AccionesCorrectivasPage() {
  const router = useRouter()
  const [incidencias, setIncidencias] = useState([])
  const [accionesAplicadas, setAccionesAplicadas] = useState([])
  const [selectedIncidencia, setSelectedIncidencia] = useState(null)
  const [accionCorrectiva, setAccionCorrectiva] = useState({
    descripcion: "",
    fechaAplicacion: new Date().toISOString().split("T")[0],
  })
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const userData = getUserData()
    const userObj = JSON.parse(localStorage.getItem("user"))
    setUserRole(userObj?.id_rol)

    // Solo admin (1) y prefecto (3) pueden acceder
    if (userObj?.id_rol !== 1 && userObj?.id_rol !== 3) {
      router.push("/dashboard")
      return
    }

    loadData()
  }, [router])

  const loadData = async () => {
    try {
      const token = getToken()

      const [pendientes, acciones] = await Promise.all([getIncidenciasPendientes(token), getAccionesCorrectivas(token)])

      setIncidencias(pendientes)
      setAccionesAplicadas(acciones)
    } catch (error) {
      console.error("[v0] Error al cargar datos:", error)
      setError("Error al cargar los datos")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const token = getToken()
      const userObj = JSON.parse(localStorage.getItem("user"))

      await aplicarAccionCorrectiva(
        selectedIncidencia,
        accionCorrectiva.descripcion,
        accionCorrectiva.fechaAplicacion,
        userObj.id_usuario,
        token,
      )

      setSuccess(true)

      // Recargar datos
      await loadData()

      // Limpiar formulario
      setAccionCorrectiva({
        descripcion: "",
        fechaAplicacion: new Date().toISOString().split("T")[0],
      })
      setSelectedIncidencia(null)

      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("[v0] Error al registrar acción correctiva:", error)
      setError(error.message || "Error al registrar acción correctiva")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario para nueva acción correctiva */}
        <Card>
          <CardHeader>
            <CardTitle>Aplicar Acciones Correctivas</CardTitle>
            <p className="text-sm text-gray-600">Registre las medidas correctivas aplicadas a las incidencias</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 text-green-600 p-3 rounded-md flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <p className="text-sm">Acción correctiva registrada exitosamente</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="incidencia">Incidencia *</Label>
                <Select value={selectedIncidencia} onValueChange={setSelectedIncidencia} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una incidencia pendiente" />
                  </SelectTrigger>
                  <SelectContent>
                    {incidencias.map((inc) => (
                      <SelectItem key={inc.id_incidencia} value={inc.id_incidencia.toString()}>
                        #{inc.id_incidencia} - {inc.alumno} - {inc.tipo_incidencia} ({inc.gravedad})
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

              <Button type="submit" className="w-full bg-[#0c6857] hover:bg-[#0a5345]" disabled={loading || success}>
                {loading ? "Guardando..." : "Registrar Acción Correctiva"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de incidencias pendientes */}
        <Card>
          <CardHeader>
            <CardTitle>Incidencias Pendientes de Atención</CardTitle>
            <p className="text-sm text-gray-600">{incidencias.length} incidencia(s) pendiente(s)</p>
          </CardHeader>
          <CardContent>
            {incidencias.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay incidencias pendientes</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {incidencias.map((inc) => (
                  <div key={inc.id_incidencia} className="border rounded-lg p-3 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          #{inc.id_incidencia} - {inc.alumno}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{inc.tipo_incidencia}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{inc.observaciones}</p>
                        <div className="flex gap-2 mt-2">
                          <span
                            className={`px-2 py-0.5 text-xs rounded ${
                              inc.gravedad === "Grave"
                                ? "bg-red-100 text-red-800"
                                : inc.gravedad === "Moderada"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {inc.gravedad}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded">{inc.estado}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setSelectedIncidencia(inc.id_incidencia.toString())}
                        className="bg-[#0c6857] hover:bg-[#0a5345] text-xs"
                      >
                        Seleccionar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Historial de Acciones Correctivas Aplicadas</CardTitle>
          <p className="text-sm text-gray-600">Últimas {accionesAplicadas.length} acciones correctivas registradas</p>
        </CardHeader>
        <CardContent>
          {accionesAplicadas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay acciones correctivas registradas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {accionesAplicadas.map((accion) => (
                <div key={accion.id_accion} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">Incidencia #{accion.id_incidencia}</span>
                        <span
                          className={`px-2 py-0.5 text-xs rounded ${
                            accion.gravedad === "Grave"
                              ? "bg-red-100 text-red-800"
                              : accion.gravedad === "Moderada"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {accion.gravedad}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">Tipo:</span> {accion.tipo_incidencia}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">Alumno(s):</span> {accion.alumnos}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">Acción aplicada:</span> {accion.descripcion}
                      </p>
                      <div className="flex gap-4 text-xs text-gray-500 mt-2">
                        <span>
                          Aplicada por: {accion.usuario_nombre} {accion.usuario_apellido}
                        </span>
                        <span>Fecha: {new Date(accion.fechaaplicacion).toLocaleDateString("es-MX")}</span>
                      </div>
                    </div>
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
