"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getToken } from "@/lib/api"
import { getUserRole, ROLES } from "@/lib/permissions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Shield } from "lucide-react"

export default function BitacoraPage() {
  const router = useRouter()
  const [actividades, setActividades] = useState([])
  const [filteredActividades, setFilteredActividades] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState("all") // Updated default value

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push("/login")
      return
    }

    const userStr = localStorage.getItem("user")
    if (userStr) {
      const user = JSON.parse(userStr)
      const userRole = getUserRole(user)

      if (userRole !== ROLES.ADMIN) {
        router.push("/dashboard")
        return
      }
    }

    const loadActividades = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/incidencias/bitacora`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const result = await response.json()
          const data = result.data || []
          setActividades(data)
          setFilteredActividades(data)
        }
      } catch (error) {
        console.error("Error al cargar bitácora:", error)
      } finally {
        setLoading(false)
      }
    }

    loadActividades()
  }, [router])

  useEffect(() => {
    let filtered = [...actividades]

    if (searchTerm) {
      filtered = filtered.filter(
        (act) =>
          act.accion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          act.usuario?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (tipoFiltro !== "all") {
      filtered = filtered.filter((act) => act.tipo === tipoFiltro)
    }

    setFilteredActividades(filtered)
  }, [searchTerm, tipoFiltro, actividades])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Cargando bitácora...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-[#0c6857]" />
          <h2 className="text-2xl font-bold">Bitácora del Sistema</h2>
        </div>
        <p className="text-gray-600 mt-1">Registro de actividades y acciones del sistema</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por usuario o acción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="INFO">Información</SelectItem>
                <SelectItem value="SUCCESS">Éxito</SelectItem>
                <SelectItem value="WARNING">Advertencia</SelectItem>
                <SelectItem value="ERROR">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Actividades</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredActividades.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No hay actividades registradas</p>
          ) : (
            <div className="space-y-3">
              {filteredActividades.map((actividad, index) => (
                <div key={index} className="border-l-4 border-[#0c6857] pl-4 py-3 bg-gray-50 rounded">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{actividad.accion}</p>
                      <div className="flex gap-4 text-xs text-gray-500 mt-1">
                        <span>Usuario: {actividad.usuario}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(actividad.fecha).toLocaleString("es-MX")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredActividades.length} de {actividades.length} registros
      </div>
    </div>
  )
}
