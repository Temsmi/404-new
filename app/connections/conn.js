import mysql from 'mysql2/promise';

let pool; // Declare pool as a mutable variable

async function createPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
       port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3307, 
      database: process.env.DB_NAME || "cms",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      waitForConnections: true,
      connectionLimit: 50,
      queueLimit: 0,
    });
  }
}

async function getPool() {
  if (!pool) {
    await createPool();
  }
}

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
    console.error('Database Error:', error);
    return { error: error.message };
  }
}
