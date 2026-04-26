import { Calendar, User, FileText, Eye, Edit, Trash2, CheckCircle } from 'lucide-react'
import Button from '../common/Button'

const estadoColors = {
  abierta: 'bg-red-100 text-red-800',
  en_proceso: 'bg-yellow-100 text-yellow-800',
  cerrada: 'bg-green-100 text-green-800'
}

const severidadColors = {
  1: 'bg-green-100 text-green-800',
  2: 'bg-yellow-100 text-yellow-800',
  3: 'bg-red-100 text-red-800'
}

function IncidenciaList({
  incidencias,
  onEdit,
  onView,
  onChangeStatus,
  onDelete,
  userRole,
  readonly = false
}) {
  if (!incidencias || incidencias.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">No hay incidencias registradas</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Folio</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grupo</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alumnos</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reportó</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severidad</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {incidencias.map((incidencia) => (
            <tr key={incidencia.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                #{incidencia.id}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                {incidencia.titulo}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {incidencia.grupo?.nombre || 'N/A'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {incidencia.alumnos?.length || 0} alumno(s)
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {incidencia.profesor?.nombre || 'N/D'}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  severidadColors[incidencia.severidad_id] || severidadColors[1]
                }`}>
                  {incidencia.severidad?.nombre || 'Leve'}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  estadoColors[incidencia.estado] || estadoColors.abierta
                }`}>
                  {incidencia.estado === 'en_proceso' ? 'En proceso' : incidencia.estado}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {new Date(incidencia.fecha).toLocaleDateString('es-MX')}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => onView(incidencia)}
                    title="Ver detalle"
                  >
                    <Eye size={16} />
                  </Button>

                  {!readonly && (userRole === 'administrador' || userRole === 'prefecto' ||
                    userRole === 'profesor') && (
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => onEdit(incidencia)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </Button>
                  )}

                  {!readonly && userRole === 'administrador' && (
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => onDelete(incidencia)}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}

                  {!readonly && (userRole === 'administrador' || userRole === 'prefecto') &&
                    incidencia.estado !== 'cerrada' && (
                    <Button
                      variant="success"
                      size="small"
                      onClick={() => onChangeStatus(incidencia.id, 'cerrada')}
                      title="Cerrar incidencia"
                    >
                      <CheckCircle size={16} />
                    </Button>
                  )}

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default IncidenciaList
