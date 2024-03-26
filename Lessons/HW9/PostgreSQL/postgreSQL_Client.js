import path from 'path';
import fs from 'fs';
import pkg from 'pg';

const { Client } = pkg;
const __dirname = path.resolve();

const client = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hillel',
    password: 'root',
    port: 5432,
});

async function connectAndQuery() {
    try {
        await client.connect();
        console.log('Connected to the database');

        const sqlFilePath = path.join(__dirname, 'createTable.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf-8');

        const queryResult = await client.query(sql);
        console.log('Tables created successfully');
    } catch (error) {
        console.error('Error during database connection:', error);
    } finally {
        // await client.end();
        // console.log('Disconnected from the database');
    }
}

export { connectAndQuery, client };
