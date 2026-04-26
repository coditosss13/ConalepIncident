import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react'

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
}

const styles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
}

/**
 * Componente de alerta reutilizable
 */
function Alert({
  type = 'info',
  message,
  onClose,
  className = ''
}) {
  const Icon = icons[type]

  return (
    <div className={`${styles[type]} border rounded-lg p-4 flex items-start gap-3 ${className}`}>
      <Icon size={20} className="flex-shrink-0 mt-0.5" />
      <p className="flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-white/50 transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}

export default Alert