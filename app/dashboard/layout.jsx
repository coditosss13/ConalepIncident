"use client"

import Sidebar from "@/components/Sidebar"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { getToken, getUserData } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, X, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [userData, setUserData] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push("/login")
      return
    }

    const user = getUserData()
    setUserData(user)
  }, [router])

  const handleLogout = () => {
    router.push("/login")
  }

  const isDashboardHome = pathname === "/dashboard"

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Sistema de Incidencias"
    if (pathname === "/dashboard/incidencias/nueva") return "Nueva Incidencia"
    if (pathname === "/dashboard/incidencias") return "Operaciones / Incidencias"
    if (pathname === "/dashboard/reportes") return "Reportes"
    if (pathname === "/dashboard/alumnos") return "Alumnos"
    if (pathname.includes("/dashboard/alumnos/")) return "Detalle del Alumno"
    if (pathname.includes("/dashboard/incidencias/")) return "Detalle de Incidencia"
    return "Sistema de Incidencias"
  }

  const showBackButton = pathname !== "/dashboard" && !pathname.endsWith("/incidencias")

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </div>

      {/* Sidebar mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white">
            <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:pl-64 w-full">
        <header className="bg-[#0c6857] text-white px-4 lg:px-6 py-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-white hover:bg-white/10"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>

              {showBackButton && (
                <Link href="/dashboard/incidencias">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
              )}

              <div>
                <h1 className="text-lg lg:text-xl font-bold">{getPageTitle()}</h1>
                {isDashboardHome && (
                  <p className="text-sm text-white/90">
                    Bienvenido, {userData.nombre} {userData.primerapell || ""}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-sm text-white/90">
                {userData.nombre} {userData.primerapell || ""}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-white/10 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
