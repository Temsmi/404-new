import mysql from 'mysql2/promise';

let globalPool = global._mysqlPool || null;

if (!globalPool) {
  globalPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'cms',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0,
  });

  if (process.env.NODE_ENV !== 'production') {
    global._mysqlPool = globalPool;
  }
}

export async function conn({ query, values = [] }) {
  try {
    const [results] = await globalPool.execute(query, values);
    return results;
  } catch (error) {
    console.error('Database Error:', error);
    return { error: error.message };
  }
}
