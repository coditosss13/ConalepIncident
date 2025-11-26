# Migración de Contraseñas a bcrypt

## Problema Detectado

Las contraseñas en tu base de datos estaban almacenadas en **texto plano**, lo cual es un grave problema de seguridad.

## Cambios Realizados

### 1. Implementación de bcrypt

- **authController.js**: Ahora usa `bcrypt.compare()` para verificar contraseñas en login
- **userModel.js**: Hashea contraseñas con `bcrypt.hash()` antes de guardarlas (10 rounds de salt)

### 2. Validación por Roles

- **incidenciaRoutes.js**: Rutas protegidas con `verifyToken` y `permitRoles()`
- Registro de incidencias: Solo roles 2 (Docente) y 3 (Coordinador)
- Consulta de incidencias: Todos los roles autenticados

### 3. Validaciones Agregadas

- Verificación de campos requeridos (usuario y contraseña)
- Mensajes de error más específicos
- Manejo correcto de errores de autenticación

## ⚠️ IMPORTANTE: Migrar Contraseñas Existentes

Si ya tienes usuarios en tu base de datos con contraseñas en texto plano, DEBES ejecutar el script de migración:

\`\`\`bash
cd backend
node scripts/migrate-passwords.js
\`\`\`

Este script:
- ✅ Hashea todas las contraseñas existentes
- ✅ Detecta contraseñas ya hasheadas y las omite
- ✅ No duplica el trabajo si lo ejecutas múltiples veces

## Verificación de Seguridad

### ✅ Implementado Correctamente:
- Bcrypt con 10 rounds de salt (estándar de la industria)
- Uso de `await` en todas las operaciones async
- No hay comparación de texto plano
- Transacciones de BD con rollback en errores
- No hay duplicación de conexiones

### ✅ Roles Implementados:
- **Administrador (rol 1)**: Acceso completo
- **Docente (rol 2)**: Registro de incidencias
- **Coordinador (rol 3)**: Validación y seguimiento

## Próximos Pasos

1. Ejecuta el script de migración si tienes usuarios existentes
2. Reinicia el servidor backend
3. Las nuevas contraseñas se guardarán automáticamente hasheadas
4. El login ahora compara correctamente con bcrypt
