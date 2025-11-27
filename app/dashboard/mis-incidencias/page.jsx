"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Eye } from "lucide-react"
import Link from "next/link"

export default function MisIncidenciasPage() {
  const [incidencias, setIncidencias] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchMisIncidencias()
  }, [])

  const fetchMisIncidencias = async () => {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/incidencias/mis-incidencias`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const result = await response.json()
        setIncidencias(result.data || [])
      }
    } catch (error) {
      console.error("Error al cargar incidencias:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredIncidencias = incidencias.filter(
    (inc) =>
      inc.alumno?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.tipo_incidencia?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getGravedadColor = (gravedad) => {
    const colors = {
      Leve: "bg-yellow-100 text-yellow-800",
      Moderada: "bg-orange-100 text-orange-800",
      Grave: "bg-red-100 text-red-800",
    }
    return colors[gravedad] || "bg-gray-100 text-gray-800"
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Incidencias Registradas</h1>
          <p className="text-gray-500 mt-1">Incidencias que he registrado en mis grupos</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por alumno o tipo de incidencia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Fecha</th>
                  <th className="text-left p-3 font-semibold">Alumno</th>
                  <th className="text-left p-3 font-semibold">Tipo</th>
                  <th className="text-left p-3 font-semibold">Gravedad</th>
                  <th className="text-left p-3 font-semibold">Estado</th>
                  <th className="text-left p-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidencias.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-8 text-gray-500">
                      No has registrado incidencias aún
                    </td>
                  </tr>
                ) : (
                  filteredIncidencias.map((incidencia) => (
                    <tr key={incidencia.id_incidencia} className="border-b hover:bg-gray-50">
                      <td className="p-3">{new Date(incidencia.fecha).toLocaleDateString()}</td>
                      <td className="p-3 font-medium">{incidencia.alumno}</td>
                      <td className="p-3">
                        <Badge variant="outline">{incidencia.tipo_incidencia}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={getGravedadColor(incidencia.gravedad)}>{incidencia.gravedad}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant={incidencia.estado === "Pendiente" ? "destructive" : "success"}>
                          {incidencia.estado}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Link href={`/dashboard/incidencias/${incidencia.id_incidencia}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
