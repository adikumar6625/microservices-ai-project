const { Pool } = require("pg");

// A single shared connection pool for the service.
// Every query goes through this — never open ad-hoc connections in routes.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Unexpected Postgres pool error:", err);
});

module.exports = pool;
