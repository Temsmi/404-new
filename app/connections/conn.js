import mysql from "mysql2/promise";
import fs from 'fs';
import path from 'path';

const globalForMySQL = globalThis;

let pool = globalForMySQL.mysqlPool || null;

async function createPool() {
  if (!pool) {
    let caCert;
    if (process.env.DB_CA_CERT) {
      // Use env var version (replace escaped newlines)
      caCert = process.env.DB_CA_CERT.replace(/\\n/g, "\n");
    } else {
      // Fallback to reading the local file
      const certPath = path.join(process.cwd(), "lib", "ca.pem");
      caCert = fs.readFileSync(certPath, "utf-8");
    }
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      database: process.env.DB_NAME ,
      user: process.env.DB_USER ,
      password: process.env.DB_PASSWORD ,
      waitForConnections: true,
      connectionLimit: 50,
      queueLimit: 0,
      ssl: {
        ca: caCert,
        rejectUnauthorized: true,
      },
    });
    globalForMySQL.mysqlPool = pool;
  }
}

async function getPool() {
  if (!pool) {
    await createPool();
  }
  return pool;
}

// Function to execute queries
export async function conn({ query, values = [] }) {
  try {
    let connectionPool = await getPool(); // Use a different variable name

    // Ensure the pool is available
    if (!connectionPool || connectionPool._closed) {
      console.log("Recreating DB connection pool...");
      pool = null; // No reassignment error now
      await createPool();
      connectionPool = await getPool(); // Re-fetch pool
    }

    const [results] = await connectionPool.execute(query, values);
    return results;
  } catch (error) {
    console.error("Database Error:", error.message, "\nQuery:", query);
    return { error: error.message };
  }
}