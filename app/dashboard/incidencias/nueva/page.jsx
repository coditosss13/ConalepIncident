"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getToken, createIncidencia, getUserData } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function NuevaIncidenciaPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    tipoIncidencia: "",
    gravedad: "",
    observaciones: "",
    estado: "Pendiente",
    fecha: new Date().toISOString().split("T")[0],
    hora: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
    id_alumno: "",
    id_grupo: "",
  })
  const [evidencias, setEvidencias] = useState([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [grupos, setGrupos] = useState([])
  const [alumnos, setAlumnos] = useState([])
  const [docenteId, setDocenteId] = useState(null)

  useEffect(() => {
    const userData = getUserData()
    const userObj = JSON.parse(localStorage.getItem("user"))
    setUserRole(userObj?.id_rol)
    setDocenteId(userObj?.id_docente)

    // Si es docente, cargar sus grupos asignados
    if (userObj?.id_rol === 2 && userObj?.id_docente) {
      loadGruposDocente(userObj.id_docente)
    }
  }, [])

  const loadGruposDocente = async (idDocente) => {
    try {
      const token = getToken()
      // Aquí deberías llamar a tu API para obtener los grupos del docente
      // const response = await fetch(`${API_URL}/docentes/${idDocente}/grupos`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // })
      // const data = await response.json()
      // setGrupos(data)
    } catch (error) {
      console.error("Error al cargar grupos:", error)
    }
  }

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter((file) => {
      const isValid = file.type.startsWith("image/") || file.type === "application/pdf"
      if (!isValid) {
        setError(`El archivo ${file.name} no es válido. Solo se permiten imágenes y PDFs.`)
      }
      return isValid
    })
    setEvidencias(validFiles)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const token = getToken()
    if (!token) {
      router.push("/login")
      return
    }

    try {
      const data = new FormData()
      data.append("tipoIncidencia", formData.tipoIncidencia)
      data.append("gravedad", formData.gravedad)
      data.append("observaciones", formData.observaciones)
      data.append("estado", formData.estado)
      data.append("fecha", formData.fecha)
      data.append("hora", formData.hora)
      data.append("id_alumno", formData.id_alumno)

      if (userRole === 2) {
        data.append("id_grupo", formData.id_grupo)
      }

      evidencias.forEach((file) => {
        data.append("evidencias", file)
      })

      await createIncidencia(data, token)
      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard/incidencias")
      }, 2000)
    } catch (err) {
      setError(err.message || "Error al crear incidencia")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Registrar Nueva Incidencia</CardTitle>
          <p className="text-sm text-gray-600">
            {userRole === 2
              ? "Registre incidencias de alumnos en sus grupos asignados"
              : "Complete los datos de la incidencia del alumno"}
          </p>
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
                <p className="text-sm">Incidencia creada exitosamente. Redirigiendo...</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="tipoIncidencia">Tipo de Incidencia *</Label>
              <Select
                value={formData.tipoIncidencia}
                onValueChange={(value) => handleChange("tipoIncidencia", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de incidencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disciplina">Disciplina</SelectItem>
                  <SelectItem value="Uniforme">Uniforme</SelectItem>
                  <SelectItem value="Violencia">Violencia</SelectItem>
                  <SelectItem value="Académico">Académico</SelectItem>
                  <SelectItem value="Asistencia">Asistencia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gravedad">Gravedad *</Label>
                <Select value={formData.gravedad} onValueChange={(value) => handleChange("gravedad", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona gravedad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baja">Baja</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="id_alumno">{userRole === 2 ? "Alumno del Grupo *" : "ID del Alumno *"}</Label>
                {userRole === 2 ? (
                  <Select
                    value={formData.id_alumno}
                    onValueChange={(value) => handleChange("id_alumno", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un alumno" />
                    </SelectTrigger>
                    <SelectContent>
                      {alumnos.map((alumno) => (
                        <SelectItem key={alumno.id_alumno} value={alumno.id_alumno}>
                          {alumno.nombre} {alumno.primerapellido} - {alumno.matricula}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="id_alumno"
                    type="number"
                    placeholder="Ingrese el ID del alumno"
                    value={formData.id_alumno}
                    onChange={(e) => handleChange("id_alumno", e.target.value)}
                    required
                  />
                )}
              </div>
            </div>

            {userRole === 2 && (
              <div className="space-y-2">
                <Label htmlFor="grupo">Grupo Asignado *</Label>
                <Select
                  value={formData.id_grupo}
                  onValueChange={(value) => {
                    handleChange("id_grupo", value)
                    // Cargar alumnos del grupo seleccionado
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {grupos.map((grupo) => (
                      <SelectItem key={grupo.id_grupo} value={grupo.id_grupo}>
                        {grupo.nombre} - {grupo.grado} {grupo.periodo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha del Incidente *</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleChange("fecha", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora">Hora del Incidente *</Label>
                <Input
                  id="hora"
                  type="time"
                  value={formData.hora}
                  onChange={(e) => handleChange("hora", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones del Personal *</Label>
              <Textarea
                id="observaciones"
                placeholder="Describa detalladamente la incidencia ocurrida..."
                value={formData.observaciones}
                onChange={(e) => handleChange("observaciones", e.target.value)}
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evidencias">Adjuntar Evidencias (Opcional)</Label>
              <p className="text-sm text-gray-500">Puede adjuntar imágenes o archivos PDF</p>
              <div className="flex items-center gap-2">
                <Input
                  id="evidencias"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="cursor-pointer"
                />
                <Upload className="h-5 w-5 text-gray-400" />
              </div>
              {evidencias.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-[#0c6857]">{evidencias.length} archivo(s) seleccionado(s):</p>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    {evidencias.map((file, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-[#0c6857]">•</span>
                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1 bg-[#0c6857] hover:bg-[#0a5345]" disabled={loading || success}>
                {loading ? "Guardando..." : "Registrar Incidencia"}
              </Button>
              <Link href="/dashboard/incidencias" className="flex-1">
                <Button type="button" variant="outline" className="w-full bg-transparent">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
