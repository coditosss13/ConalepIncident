import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { Mail, Lock, User } from 'lucide-react'

function UsuarioForm({ usuario, roles, onSubmit, onCancel, loading }) {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      nombre: usuario?.nombre || '',
      email: usuario?.email || '',
      password: '',
      rol_id: usuario?.rol_id?.toString() || '',
      activo: usuario?.activo?.toString() || 'true'
    }
  })

  useEffect(() => {
    if (usuario) {
      reset({
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        password: '',
        rol_id: usuario.rol_id?.toString() || '',
        activo: usuario.activo?.toString() || 'true'
      })
    } else {
      reset({
        nombre: '',
        email: '',
        password: '',
        rol_id: '',
        activo: 'true'
      })
    }
  }, [usuario, reset])

  const onFormSubmit = (data) => {
    const formData = {
      ...data,
      rol_id: parseInt(data.rol_id),
      activo: data.activo === 'true'
    }

    // Solo incluir password si se proporciona
    if (!formData.password) {
      delete formData.password
    }

    onSubmit(formData)
  }

  const roleOptions = roles.map(rol => ({
    value: rol.id.toString(),
    label: rol.nombre.charAt(0).toUpperCase() + rol.nombre.slice(1)
  }))

  const statusOptions = [
    { value: 'true', label: 'Activo' },
    { value: 'false', label: 'Inactivo' }
  ]

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Nombre */}
      <Input
        label="Nombre completo"
        name="nombre"
        placeholder="Juan Pérez"
        icon={User}
        required
        {...register('nombre', {
          required: 'El nombre es requerido',
          minLength: { value: 3, message: 'Mínimo 3 caracteres' }
        })}
        error={errors.nombre?.message}
      />

      {/* Email */}
      <Input
        label="Correo electrónico"
        name="email"
        type="email"
        placeholder="correo@ejemplo.com"
        icon={Mail}
        required
        {...register('email', {
          required: 'El email es requerido',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email inválido'
          }
        })}
        error={errors.email?.message}
      />

      {/* Password */}
      <div className="relative">
        <Input
          label={usuario ? 'Nueva contraseña (dejar vacío para mantener)' : 'Contraseña'}
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          icon={Lock}
          required={!usuario}
          {...register('password', {
            ...(usuario ? {} : { required: 'La contraseña es requerida' }),
            minLength: { value: 6, message: 'Mínimo 6 caracteres' }
          })}
          error={errors.password?.message}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>

      {/* Rol */}
      <Select
        label="Rol"
        name="rol_id"
        options={roleOptions}
        placeholder="Seleccionar rol..."
        required
        {...register('rol_id', {
          required: 'El rol es requerido'
        })}
        error={errors.rol_id?.message}
        value={watch('rol_id')}
      />

      {/* Estado (solo en edición) */}
      {usuario && (
        <Select
          label="Estado"
          name="activo"
          options={statusOptions}
          {...register('activo')}
          value={watch('activo')}
        />
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {usuario ? 'Actualizar' : 'Crear'} Usuario
        </Button>
      </div>
    </form>
  )
}

export default UsuarioForm