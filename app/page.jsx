"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getToken } from "@/lib/api"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const token = getToken()
    if (token) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0c6857]">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-white">Sistema de Incidencias Escolares</h1>
        <p className="text-white/80">Cargando...</p>
      </div>
    </div>
  )
}
