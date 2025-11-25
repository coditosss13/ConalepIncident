"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  Settings,
  FileText,
  PlusCircle,
  List,
  FileBarChart,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Shield,
  Users,
  LogOut,
} from "lucide-react"
import { useState, useEffect } from "react"
import { getUserRole, ROLES } from "@/lib/permissions"
import { removeToken } from "@/lib/api"

export default function Sidebar({ onNavigate }) {
  const pathname = usePathname()
  const router = useRouter()
  const [operacionesOpen, setOperacionesOpen] = useState(true)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      const user = JSON.parse(userStr)
      setUserRole(getUserRole(user))
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

  return (
    <aside className="w-64 bg-[#0c6857] text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="CONALEP Logo" width={40} height={40} className="rounded" />
          <span className="font-bold text-xl">CONALEP</span>
        </div>
      </div>

      <nav className="flex-1 py-6 overflow-y-auto">
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

        {userRole === ROLES.ADMIN && (
          <>
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
              href="/dashboard/configuracion"
              onClick={handleClick}
              className={`flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors ${
                isActive("/dashboard/configuracion") ? "bg-white/20 border-l-4 border-white" : ""
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Configuración</span>
            </Link>
          </>
        )}

        <div>
          <button
            onClick={() => setOperacionesOpen(!operacionesOpen)}
            className="flex items-center justify-between w-full px-6 py-3 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5" />
              <span>Operaciones</span>
            </div>
            {operacionesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          {operacionesOpen && (
            <div className="bg-white/5">
              <Link
                href="/dashboard/incidencias/nueva"
                onClick={handleClick}
                className={`flex items-center gap-3 px-12 py-2.5 hover:bg-white/10 transition-colors ${
                  isActive("/dashboard/incidencias/nueva") ? "bg-white/20 border-l-4 border-white" : ""
                }`}
              >
                <PlusCircle className="h-4 w-4" />
                <span className="text-sm">Nueva Incidencia</span>
              </Link>

              <Link
                href="/dashboard/incidencias"
                onClick={handleClick}
                className={`flex items-center gap-3 px-12 py-2.5 hover:bg-white/10 transition-colors ${
                  isActive("/dashboard/incidencias") ? "bg-white/20 border-l-4 border-white" : ""
                }`}
              >
                <List className="h-4 w-4" />
                <span className="text-sm">Incidencias</span>
              </Link>

              <Link
                href="/dashboard/reporte-incidencias"
                onClick={handleClick}
                className={`flex items-center gap-3 px-12 py-2.5 hover:bg-white/10 transition-colors ${
                  isActive("/dashboard/reporte-incidencias") ? "bg-white/20 border-l-4 border-white" : ""
                }`}
              >
                <FileBarChart className="h-4 w-4" />
                <span className="text-sm">Reporte Incidencias</span>
              </Link>
            </div>
          )}
        </div>

        {(userRole === ROLES.ADMIN || userRole === ROLES.COORDINADOR) && (
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
        )}

        {userRole === ROLES.ADMIN && (
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
        )}
      </nav>

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
