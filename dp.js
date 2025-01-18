import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  user: process.env.DB_USER || "default_user",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "default_db",
  password: process.env.DB_PASSWORD || "default_password",
  port: process.env.DB_PORT || 5432,
});

export default pool;
