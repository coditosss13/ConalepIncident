import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import RoleRoute from './components/auth/RoleRoute'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Usuarios from './pages/Usuarios'
import Incidencias from './pages/Incidencias'
import Alumnos from './pages/Alumnos'
import Grupos from './pages/Grupos'
import Metricas from './pages/Metricas'
import Seguimientos from './pages/Seguimientos'

function App() {
  return (
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Incidencias - Todos los roles autenticados */}
              <Route path="/incidencias" element={<Incidencias />} />

              {/* Alumnos y Grupos - Todos los roles autenticados */}
              <Route path="/alumnos" element={<Alumnos />} />
              <Route path="/grupos" element={<Grupos />} />

              {/* Rutas solo para admin */}
              <Route element={<RoleRoute roles={['administrador']} />}>
                <Route path="/usuarios" element={<Usuarios />} />
              </Route>

              {/* Rutas solo para prefecto y admin */}
              <Route element={<RoleRoute roles={['prefecto', 'administrador']} />}>
                <Route path="/metricas" element={<Metricas />} />
                <Route path="/seguimientos" element={<Seguimientos />} />
              </Route>
            </Route>
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
      </BrowserRouter>
  )
}

export default App