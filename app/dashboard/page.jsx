"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getToken } from "@/lib/api"
import { getUserRole, ROLES } from "@/lib/permissions"
import DashboardAdmin from "@/components/dashboards/DashboardAdmin"
import DashboardDocente from "@/components/dashboards/DashboardDocente"
import DashboardPrefecto from "@/components/dashboards/DashboardPrefecto"

export default function DashboardPage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push("/login")
      return
    }

    const userStr = localStorage.getItem("user")
    if (!userStr) {
      console.error("[v0] No se encontró usuario en localStorage")
      router.push("/login")
      return
    }

    const userData = JSON.parse(userStr)
    console.log("[v0] Usuario cargado:", userData)

    const role = getUserRole(userData)
    console.log("[v0] Rol del usuario:", role)

    setUserRole(role)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-[#0c6857] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (userRole === ROLES.ADMIN) {
    return <DashboardAdmin />
  }

  if (userRole === ROLES.DOCENTE) {
    return <DashboardDocente />
  }

  if (userRole === ROLES.PREFECTO) {
    return <DashboardPrefecto />
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg text-red-600">Rol no reconocido. Por favor, contacta al administrador.</p>
    </div>
  )
}
