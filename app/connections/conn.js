import mysql from "mysql2/promise";

let pool; // Declare pool as a mutable variable

async function createPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      database: process.env.DB_NAME ,
      user: process.env.DB_USER ,
      password: process.env.DB_PASSWORD ,
      waitForConnections: true,
      connectionLimit: 50,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: true,
      },
    });
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
    console.error("Database Error:", error);
    return { error: error.message };
  }
}