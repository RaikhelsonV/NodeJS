import webContext from './webContext.js';
import express from 'express';
import dotenv from 'dotenv';
import appLogger from "appLogger";


dotenv.config();

const log = appLogger.getLogger('app.js');


const PORT = process.env.PORT;
const app = express();
webContext(app);

app.listen(PORT, () => {
    log.info('Server started')
});
