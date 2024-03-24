import webContext from './webContext.js';
import express from 'express';
import dotenv from 'dotenv';
import { connectAndQuery } from './PostgreSQL/PostgreSQL_Client.js';

dotenv.config();

connectAndQuery();

const PORT = process.env.PORT;
const app = express();
webContext(app);

app.listen(PORT, () => {
    console.log('Server started');
});
