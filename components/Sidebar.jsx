"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  Settings,
  PlusCircle,
  List,
  FileBarChart,
  BarChart3,
  Users,
  LogOut,
  Shield,
  CheckCircle,
} from "lucide-react"
import { useState, useEffect } from "react"
import { getUserRole, ROLES } from "@/lib/permissions"
import { removeToken } from "@/lib/api"

export default function Sidebar({ onNavigate }) {
  const pathname = usePathname()
  const router = useRouter()
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        const role = getUserRole(user)
        setUserRole(role)
      } catch (err) {
        console.error("Error parsing user:", err)
      }
    }
  }, [])

  const isActive = (path) => pathname === path

  const handleClick = () => {
    if (onNavigate) onNavigate()
  }

  const handleLogout = () => {
    removeToken()
    router.push("/login")
  }

  const renderMenuByRole = () => {
    // ADMINISTRADOR: Control total
    if (userRole === ROLES.ADMIN) {
      return (
        <>
          <Link
            href="/dashboard"
            onClick={handleClick}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
              isActive("/dashboard") ? "bg-white/20 border-l-4 border-white" : ""
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/dashboard/usuarios"
            onClick={handleClick}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
              isActive("/dashboard/usuarios") ? "bg-white/20 border-l-4 border-white" : ""
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Gestión de Usuarios</span>
          </Link>

          <Link
            href="/dashboard/incidencias"
            onClick={handleClick}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
              isActive("/dashboard/incidencias") ? "bg-white/20 border-l-4 border-white" : ""
            }`}
          >
            <List className="h-5 w-5" />
            <span>Todas las Incidencias</span>
          </Link>

          <Link
            href="/dashboard/reportes"
            onClick={handleClick}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
              isActive("/dashboard/reportes") ? "bg-white/20 border-l-4 border-white" : ""
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Reportes Generales</span>
          </Link>

          <Link
            href="/dashboard/configuracion"
            onClick={handleClick}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
              isActive("/dashboard/configuracion") ? "bg-white/20 border-l-4 border-white" : ""
            }`}
          >
            <Settings className="h-5 w-5" />
            <span>Configuración</span>
          </Link>

          <Link
            href="/dashboard/bitacora"
            onClick={handleClick}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
              isActive("/dashboard/bitacora") ? "bg-white/20 border-l-4 border-white" : ""
            }`}
          >
            <Shield className="h-5 w-5" />
            <span>Bitácora</span>
          </Link>
        </>
      )
    }

    // DOCENTE: Solo registro de incidencias
    if (userRole === ROLES.DOCENTE) {
      return (
        <>
          <Link
            href="/dashboard"
            onClick={handleClick}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
              isActive("/dashboard") ? "bg-white/20 border-l-4 border-white" : ""
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/dashboard/incidencias/nueva"
            onClick={handleClick}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
              isActive("/dashboard/incidencias/nueva") ? "bg-white/20 border-l-4 border-white" : ""
            }`}
          >
            <PlusCircle className="h-5 w-5" />
            <span>Registrar Incidencia</span>
          </Link>

          <Link
            href="/dashboard/mis-incidencias"
            onClick={handleClick}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
              isActive("/dashboard/mis-incidencias") ? "bg-white/20 border-l-4 border-white" : ""
            }`}
          >
            <List className="h-5 w-5" />
            <span>Mis Incidencias</span>
          </Link>
        </>
      )
    }

    // COORDINADOR: Seguimiento, validación y reportes
    if (userRole === ROLES.COORDINADOR) {
      return (
        <>
          <Link
            href="/dashboard"
            onClick={handleClick}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
              isActive("/dashboard") ? "bg-white/20 border-l-4 border-white" : ""
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/dashboard/incidencias"
            onClick={handleClick}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
              isActive("/dashboard/incidencias") ? "bg-white/20 border-l-4 border-white" : ""
            }`}
          >
            <List className="h-5 w-5" />
            <span>Seguimiento Incidencias</span>
          </Link>

          <Link
            href="/dashboard/validacion"
            onClick={handleClick}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
              isActive("/dashboard/validacion") ? "bg-white/20 border-l-4 border-white" : ""
            }`}
          >
            <CheckCircle className="h-5 w-5" />
            <span>Validar Incidencias</span>
          </Link>

          <Link
            href="/dashboard/acciones-correctivas"
            onClick={handleClick}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
              isActive("/dashboard/acciones-correctivas") ? "bg-white/20 border-l-4 border-white" : ""
            }`}
          >
            <FileBarChart className="h-5 w-5" />
            <span>Acciones Correctivas</span>
          </Link>

          <Link
            href="/dashboard/reportes"
            onClick={handleClick}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
              isActive("/dashboard/reportes") ? "bg-white/20 border-l-4 border-white" : ""
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Reportes</span>
          </Link>
        </>
      )
    }

    if (userRole === ROLES.PREFECTO) {
      return (
        <>
          <Link
            href="/dashboard"
            onClick={handleClick}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
              isActive("/dashboard") ? "bg-white/20 border-l-4 border-white" : ""
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/dashboard/incidencias"
            onClick={handleClick}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
              isActive("/dashboard/incidencias") ? "bg-white/20 border-l-4 border-white" : ""
            }`}
          >
            <List className="h-5 w-5" />
            <span>Seguimiento Incidencias</span>
          </Link>

          <Link
            href="/dashboard/validacion"
            onClick={handleClick}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
              isActive("/dashboard/validacion") ? "bg-white/20 border-l-4 border-white" : ""
            }`}
          >
            <CheckCircle className="h-5 w-5" />
            <span>Validar Incidencias</span>
          </Link>

          <Link
            href="/dashboard/acciones-correctivas"
            onClick={handleClick}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
              isActive("/dashboard/acciones-correctivas") ? "bg-white/20 border-l-4 border-white" : ""
            }`}
          >
            <FileBarChart className="h-5 w-5" />
            <span>Acciones Correctivas</span>
          </Link>

          <Link
            href="/dashboard/reportes"
            onClick={handleClick}
            className={`flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
              isActive("/dashboard/reportes") ? "bg-white/20 border-l-4 border-white" : ""
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Reportes</span>
          </Link>
        </>
      )
    }

    return null
  }

  return (
    <aside className="w-64 bg-[#0c6857] text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="CONALEP Logo" width={40} height={40} className="rounded" />
          <span className="font-bold text-xl">CONALEP</span>
        </div>
      </div>

      <nav className="flex-1 py-6 overflow-y-auto">{renderMenuByRole()}</nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full hover:bg-white/10 transition-colors rounded-lg"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}
