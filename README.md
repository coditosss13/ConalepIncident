Proyecto backend desarrollado en Node.js + Express + PostgreSQL, permite hasta ahora:

✔ Registrar incidencias
✔ Relacionar alumnos involucrados
✔ Consultar todas las incidencias
✔ Consultar una incidencia por ID

//DEPENDENCIAS NECESARIAS
express:	Framework para crear el servidor y rutas
pg:	Cliente PostgreSQL
pg-pool: (incluido en pg)	Manejo de pool de        conexiones.
multer:	Subida de archivos/imágenes
fs: (nativo)	Manejo de archivos
path: (nativo)	Manejo de rutas de sistema
dotenv:	Variables de entorno (.env)
cors:	Permite peticiones desde frontend o Postman
nodemon: (dev)	Reinicio automático del servidor

//INSTALACION DESDE CERO
git clone https://github.com/TU-USUARIO/ConalepIncident.git
cd ConalepIncident
npm install

cp .env.example .env //editar credenciales

npm install express pg multer dotenv cors
npm install -D nodemon

//CORRER SERVER
npm run dev