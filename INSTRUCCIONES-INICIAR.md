# Como Iniciar el Proyecto Completo

## Opción 1: Iniciar Frontend y Backend juntos (Recomendado)

Ejecuta este comando en la raíz del proyecto:

\`\`\`bash
npm run dev:full
\`\`\`

Esto iniciará:
- Frontend en http://localhost:3000
- Backend en http://localhost:4000

## Opción 2: Iniciar por separado

### Terminal 1 - Backend:
\`\`\`bash
cd backend
node server.js
\`\`\`

### Terminal 2 - Frontend:
\`\`\`bash
npm run dev
\`\`\`

## Credenciales de Prueba

Usa cualquier usuario que tengas registrado en tu base de datos `incidencias`.

## Verificar que funciona

1. Abre http://localhost:3000
2. Verás la página de login
3. Ingresa tus credenciales
4. Deberías acceder al dashboard

## Problemas Comunes

- **Error de conexión a base de datos**: Verifica que PostgreSQL esté corriendo y que la contraseña en `backend/.env` sea correcta
- **Puerto ocupado**: Si el puerto 3000 o 4000 está ocupado, cierra la aplicación que lo está usando
