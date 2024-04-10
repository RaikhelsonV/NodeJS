import path from 'path';
import fs from 'fs';
import pkg from 'pg';
import dotenv from "dotenv";

dotenv.config();
const {Pool} = pkg;
const __dirname = path.resolve();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function createTable() {
    const client = await pool.connect();
    try {
        const sqlFilePath = path.join(__dirname, 'createTable.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf-8');
        const queryResult = await client.query(sql);
        console.log('Tables created successfully');
    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        client.release();
    }
}

createTable();

export {pool};
