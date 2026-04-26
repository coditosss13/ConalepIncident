import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Button from '../common/Button'
import { Lock, Eye, EyeOff } from 'lucide-react'

function PasswordModal({ isOpen, onClose, usuario, onSubmit, loading }) {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  const onFormSubmit = (data) => {
    onSubmit(usuario.id, data.newPassword)
    reset()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!usuario) return null

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Cambiar Contraseña" size="small">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <p className="text-gray-600">
          Cambiando contraseña para: <span className="font-medium">{usuario.nombre}</span>
        </p>

        <div className="relative">
          <Input
            label="Nueva contraseña"
            name="newPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            icon={Lock}
            required
            {...register('newPassword', {
              required: 'La contraseña es requerida',
              minLength: { value: 6, message: 'Mínimo 6 caracteres' }
            })}
            error={errors.newPassword?.message}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Guardar Contraseña
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default PasswordModal