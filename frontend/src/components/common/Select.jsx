import { forwardRef } from 'react'

const Select = forwardRef(function Select({
  label,
  name,
  options,
  value,
  onChange,
  onBlur,
  placeholder = 'Seleccionar...',
  error,
  required = false,
  disabled = false,
  className = '',
  ...rest
}, ref) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        {...rest}
        className={`input ${error ? 'input-error' : ''} ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
})

export default Select