import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',        // tu usuario
  host: 'localhost',
  database: 'IncidenciasCona', // tu BD
  password: 'Mimama90!',
  port: 5432
});

export default pool;
