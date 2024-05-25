import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

// Handling connection event
pool.on("connect", () => {
  console.log("Connected to the database");
});
pool.on("error", (err) => {
  console.log("Error to connect Db", err);
});

export default pool;
