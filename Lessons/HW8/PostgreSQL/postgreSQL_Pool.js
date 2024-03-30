import path from 'path';
import fs from 'fs';
import pkg from 'pg';

const {Pool} = pkg;

const __dirname = path.resolve();

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hillel',
    password: 'root',
    port: 5432,
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
