import mysql from "mysql2/promise";

export async function conn({ query, values = [] }) {
    const dbconnection = await mysql.createConnection({
        host: "localhost",
        database: "cms",
        user: "root",
        password: "",
    });

    try {
        const [results] = await dbconnection.execute(query, values);
        await dbconnection.end(); // Use await to properly close the connection
        return results;
    } catch (error) {
        console.error(" Database Error:", error);
        return { error: error.message };
    }
}
