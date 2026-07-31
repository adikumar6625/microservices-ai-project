const { Client } = require("pg");

   const connectionString = process.argv[2];

   if (!connectionString) {
     console.error("\nMissing connection string.\n");
     console.error('Usage: node migrate.js "postgresql://..."\n');
     process.exit(1);
   }

   const sql = `
     CREATE EXTENSION IF NOT EXISTS "pgcrypto";

     CREATE TABLE IF NOT EXISTS users (
         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
         email VARCHAR(255) UNIQUE NOT NULL,
         password_hash VARCHAR(255) NOT NULL,
         created_at TIMESTAMP NOT NULL DEFAULT NOW()
     );

     CREATE TABLE IF NOT EXISTS orders (
         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
         user_id UUID NOT NULL,
         items JSONB NOT NULL DEFAULT '[]',
         status VARCHAR(50) NOT NULL DEFAULT 'pending',
         created_at TIMESTAMP NOT NULL DEFAULT NOW()
     );
   `;

   async function main() {
     const client = new Client({
       connectionString,
       ssl: { rejectUnauthorized: false },
     });

     try {
       console.log("Connecting to your Render database...");
       await client.connect();
       console.log("Connected. Creating tables...");
       await client.query(sql);
       console.log("\n✅ Success — 'users' and 'orders' tables are ready.\n");
     } catch (err) {
       console.error("\n❌ Something went wrong:\n");
       console.error(err.message);
       process.exit(1);
     } finally {
       await client.end();
     }
   }

   main();