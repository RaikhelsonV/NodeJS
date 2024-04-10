import webContext from './webContext.js';
import express from 'express';
import dotenv from 'dotenv';


dotenv.config();


const PORT = process.env.PORT;
const app = express();
webContext(app);

app.listen(PORT, () => {
    console.log('Server started');
});
