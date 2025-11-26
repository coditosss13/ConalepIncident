"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getToken, getIncidencias, getUserData } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, FileText, Printer, ImageIcon } from "lucide-react"
import { ROLES } from "@/lib/permissions"

export default function IncidenciasPage() {
  const router = useRouter()
  const [incidencias, setIncidencias] = useState([])
  const [filteredIncidencias, setFilteredIncidencias] = useState([])
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [estudiante, setEstudiante] = useState("")
  const [tipoResultado, setTipoResultado] = useState("NO_FINALIZADOS")
  const [tipoIncidencia, setTipoIncidencia] = useState("")
  const [gravedad, setGravedad] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState(null)
  const [userId, setUserId] = useState(null)

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
        setFilteredIncidencias(data)
      } catch (error) {
        console.error("Error al cargar incidencias:", error)
      } finally {
        setLoading(false)
      }
    }

    loadIncidencias()

    const userData = getUserData()
    if (userData) {
      const userObj = JSON.parse(localStorage.getItem("user"))
      setUserRole(userObj?.id_rol)
      setUserId(userObj?.id_usuario)
    }
  }, [router])

  const handleBuscar = () => {
    let filtered = [...incidencias]

    if (fechaInicio) {
      filtered = filtered.filter((inc) => new Date(inc.fecha) >= new Date(fechaInicio))
    }

    if (fechaFin) {
      filtered = filtered.filter((inc) => new Date(inc.fecha) <= new Date(fechaFin))
    }

    if (estudiante) {
      filtered = filtered.filter((inc) => inc.nombre_alumno?.toLowerCase().includes(estudiante.toLowerCase()))
    }

    if (tipoIncidencia) {
      filtered = filtered.filter((inc) => inc.tipo_incidencia === tipoIncidencia)
    }

    if (gravedad) {
      filtered = filtered.filter((inc) => inc.gravedad === gravedad)
    }

    if (tipoResultado === "FINALIZADOS") {
      filtered = filtered.filter((inc) => inc.estado === "Resuelta")
    } else if (tipoResultado === "NO_FINALIZADOS") {
      filtered = filtered.filter((inc) => inc.estado !== "Resuelta")
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (inc) =>
          inc.observaciones?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inc.nombre_alumno?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inc.tipo_incidencia?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredIncidencias(filtered)
  }

  useEffect(() => {
    handleBuscar()
  }, [fechaInicio, fechaFin, estudiante, tipoResultado, tipoIncidencia, gravedad, searchTerm, incidencias])

  const getEstadoBadge = (estado) => {
    if (estado === "Resuelta") return "bg-green-500 text-white"
    if (estado === "En Proceso") return "bg-blue-500 text-white"
    return "bg-yellow-500 text-white"
  }

  const getMonitoreoBadge = (gravedad) => {
    if (gravedad === "Grave") return "bg-red-500 text-white"
    if (gravedad === "Moderada") return "bg-cyan-500 text-white"
    return "bg-teal-500 text-white"
  }

  const canModifyIncidencia = (incidencia) => {
    if (userRole === ROLES.ADMIN) return true
    if (userRole === ROLES.COORDINADOR) return true
    if (userRole === ROLES.DOCENTE && incidencia.id_usuario === userId) return true
    return false
  }

  const canFinalizeIncidencia = () => {
    return userRole === ROLES.ADMIN || userRole === ROLES.COORDINADOR
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Cargando incidencias...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg text-gray-600">Operaciones / Incidencias</h2>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
            <Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
            <Input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estudiante</label>
            <Input
              type="text"
              placeholder="Buscar estudiante..."
              value={estudiante}
              onChange={(e) => setEstudiante(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Resultado</label>
            <Select value={tipoResultado} onValueChange={setTipoResultado}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">TODOS</SelectItem>
                <SelectItem value="FINALIZADOS">FINALIZADOS</SelectItem>
                <SelectItem value="NO_FINALIZADOS">NO FINALIZADOS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Incidencia</label>
            <Select value={tipoIncidencia || "Todos"} onValueChange={setTipoIncidencia}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Disciplina">Disciplina</SelectItem>
                <SelectItem value="Uniforme">Uniforme</SelectItem>
                <SelectItem value="Violencia">Violencia</SelectItem>
                <SelectItem value="Académico">Académico</SelectItem>
                <SelectItem value="Asistencia">Asistencia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gravedad</label>
            <Select value={gravedad || "Todas"} onValueChange={setGravedad}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las gravedades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas</SelectItem>
                <SelectItem value="Leve">Leve</SelectItem>
                <SelectItem value="Moderada">Moderada</SelectItem>
                <SelectItem value="Grave">Grave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleBuscar} className="bg-[#f59e0b] hover:bg-[#d97706] text-white">
          <Search className="mr-2 h-4 w-4" />
          Buscar
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>

            <Button variant="outline" size="sm" className="bg-green-600 text-white hover:bg-green-700">
              <FileText className="mr-2 h-4 w-4" />
              Excel
            </Button>

            <Button variant="outline" size="sm">
              Mostrar Columnas ▼
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ACCIÓN</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">FECHA</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ESTUDIANTE</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">INCIDENCIA</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ESTADOS</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">MONITOREO</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">DESCRIPCIÓN</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">TIPO INCIDENCIA</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">LUGAR</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">FOTOS</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidencias.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                    No se encontraron incidencias
                  </td>
                </tr>
              ) : (
                filteredIncidencias.map((inc) => (
                  <tr key={inc.id_incidencia} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {canModifyIncidencia(inc) && (
                          <Button size="sm" variant="destructive" className="h-7 px-2 text-xs">
                            Derivar
                          </Button>
                        )}
                        {canFinalizeIncidencia() && inc.estado !== "Resuelta" && (
                          <Button size="sm" className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700">
                            Finalizar
                          </Button>
                        )}
                        {userRole === ROLES.DOCENTE && !canModifyIncidencia(inc) && (
                          <span className="text-xs text-gray-500">Solo lectura</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(inc.fecha).toLocaleString("es-MX", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">{inc.nombre_alumno || "-"}</td>
                    <td className="px-4 py-3">{inc.id_incidencia}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${getEstadoBadge(
                          inc.estado,
                        )}`}
                      >
                        {inc.estado === "Resuelta" ? "● REGISTRADO" : "● EN PROCESO"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded text-xs font-medium inline-block ${getMonitoreoBadge(
                          inc.gravedad,
                        )}`}
                      >
                        {inc.gravedad?.toUpperCase() || "TESTING"}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate">{inc.observaciones || "-"}</td>
                    <td className="px-4 py-3">{inc.tipo_incidencia || "TESTING"}</td>
                    <td className="px-4 py-3">{inc.lugar || "PATIO ACADÉMICO"}</td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 bg-teal-500 hover:bg-teal-600 text-white"
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredIncidencias.length} de {incidencias.length} registros
      </div>
    </div>
  )
}
