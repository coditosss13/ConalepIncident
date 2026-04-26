/**
 * Componente de carga
 */
function Loading({ size = 'medium', text = '' }) {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-primary border-t-transparent`}
      />
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  )
}

export default Loading