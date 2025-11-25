"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUserData } from "@/lib/api"
import { getUserRole, canManageUsers } from "@/lib/permissions"
import { useRouter } from "next/navigation"
import { UserPlus, Edit, Trash2, Search } from "lucide-react"

export default function UsuariosPage() {
  const router = useRouter()
  const [usuarios, setUsuarios] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    nombre: "",
    primerapell: "",
    segundoapell: "",
    usuario: "",
    password: "",
    id_rol: "2",
    id_docente: "",
  })

  useEffect(() => {
    const user = getUserData()
    const userRole = getUserRole(user)

    if (!canManageUsers(userRole)) {
      router.push("/dashboard")
      return
    }

    // Cargar usuarios (simulado por ahora)
    setUsuarios([
      {
        id_usuario: 1,
        nombre: "Miguel",
        primerapell: "Leon",
        segundoapell: "Garcia",
        usuario: "miguel.leon",
        id_rol: 1,
        rol: "Administrador",
      },
      {
        id_usuario: 2,
        nombre: "Ana",
        primerapell: "Martinez",
        segundoapell: "Lopez",
        usuario: "ana.martinez",
        id_rol: 2,
        rol: "Docente",
      },
      {
        id_usuario: 3,
        nombre: "Carlos",
        primerapell: "Hernandez",
        segundoapell: "Perez",
        usuario: "carlos.hernandez",
        id_rol: 3,
        rol: "Coordinador",
      },
    ])
  }, [router])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí se implementaría la lógica de guardar en el backend
    console.log("[v0] Guardando usuario:", formData)
    setShowForm(false)
    setEditingUser(null)
    setFormData({
      nombre: "",
      primerapell: "",
      segundoapell: "",
      usuario: "",
      password: "",
      id_rol: "2",
      id_docente: "",
    })
  }

  const handleEdit = (usuario) => {
    setEditingUser(usuario)
    setFormData({
      nombre: usuario.nombre,
      primerapell: usuario.primerapell,
      segundoapell: usuario.segundoapell,
      usuario: usuario.usuario,
      password: "",
      id_rol: usuario.id_rol.toString(),
      id_docente: usuario.id_docente || "",
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm("¿Está seguro de eliminar este usuario?")) {
      console.log("[v0] Eliminando usuario:", id)
      setUsuarios(usuarios.filter((u) => u.id_usuario !== id))
    }
  }

  const filteredUsuarios = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.primerapell.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.rol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
        <Button onClick={() => setShowForm(true)} className="bg-[#0c6857] hover:bg-[#094d3f]">
          <UserPlus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="primerapell">Primer Apellido</Label>
              <Input
                id="primerapell"
                value={formData.primerapell}
                onChange={(e) => setFormData({ ...formData, primerapell: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="segundoapell">Segundo Apellido</Label>
              <Input
                id="segundoapell"
                value={formData.segundoapell}
                onChange={(e) => setFormData({ ...formData, segundoapell: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="usuario">Usuario</Label>
              <Input
                id="usuario"
                value={formData.usuario}
                onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingUser}
                placeholder={editingUser ? "Dejar en blanco para mantener" : ""}
              />
            </div>

            <div>
              <Label htmlFor="rol">Rol</Label>
              <Select value={formData.id_rol} onValueChange={(value) => setFormData({ ...formData, id_rol: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Administrador</SelectItem>
                  <SelectItem value="2">Docente</SelectItem>
                  <SelectItem value="3">Coordinador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingUser(null)
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#0c6857] hover:bg-[#094d3f]">
                {editingUser ? "Actualizar" : "Guardar"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Usuario</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsuarios.map((usuario) => (
                <tr key={usuario.id_usuario} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    {usuario.nombre} {usuario.primerapell} {usuario.segundoapell}
                  </td>
                  <td className="px-4 py-3 text-sm">{usuario.usuario}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        usuario.id_rol === 1
                          ? "bg-red-100 text-red-800"
                          : usuario.id_rol === 3
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {usuario.rol}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex justify-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(usuario)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50 bg-transparent"
                        onClick={() => handleDelete(usuario.id_usuario)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsuarios.length === 0 && (
            <div className="text-center py-8 text-gray-500">No se encontraron usuarios</div>
          )}
        </div>
      </Card>
    </div>
  )
}
