function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return 'La contraseña es requerida';
  }
  if (password.trim().length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }

  return null;
}

module.exports = {
  validatePasswordStrength
};
