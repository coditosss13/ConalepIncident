import dotenv from "dotenv"
dotenv.config()

import pkg from "pg"
const { Pool } = pkg

console.log("DEBUG PG CONFIG:")
console.log("USER:     ", process.env.DB_USER)
console.log("HOST:     ", process.env.DB_HOST)
console.log("DB NAME:  ", process.env.DB_NAME)
console.log("PASSWORD: ", process.env.DB_PASSWORD, " - TYPE:", typeof process.env.DB_PASSWORD)
console.log("PORT:     ", process.env.DB_PORT, " - TYPE:", typeof process.env.DB_PORT)

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "incidencias",
  password: process.env.DB_PASSWORD || "admin2004",
  port: process.env.DB_PORT || 5432,
})

export default pool
