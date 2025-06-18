import mysql from "mysql2/promise";

let pool; 

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
  return pool;
}

export async function conn({ query, values = [] }) {
  try {
    let connectionPool = await getPool(); 
    if (!connectionPool || connectionPool._closed) {
      console.log("Recreating DB connection pool...");
      pool = null;
      await createPool();
      connectionPool = await getPool(); 
    }

    const [results] = await connectionPool.execute(query, values);
    return results;
  } catch (error) {
    console.error("Database Error:", error);
    return { error: error.message };
  }
}