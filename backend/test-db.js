const db = require("./db");

async function testDatabase() {
    try {
        const connection = await db.getConnection();
        console.log("MySQL Database Connected Successfully!");
        connection.release();
    } catch (error) {
        console.log("Database Connection Failed!");
        console.log(error.message);
    }
}

testDatabase();