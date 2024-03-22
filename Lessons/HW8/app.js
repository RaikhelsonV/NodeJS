import express from 'express';
import UrlController from './controllers/UrlController.js';
import UserController from './controllers/userController.js';
import CodeController from './controllers/codeController.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

const app = express();
const PORT = 3001;

let redisClient = createClient({ url: 'redis://127.0.0.1:6379' });
redisClient.connect().catch(console.error);

let redisStore = new RedisStore({
    client: redisClient,
});

app.use(cookieParser());

const userController = new UserController();
const urlController = new UrlController();
const codeController = new CodeController(redisClient);

app.use(
    session({
        secret: '1',
        store: redisStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            domain: '127.0.0.1',
            maxAge: 3600000,
        },
    })
);
app.use('/url', urlController);
app.use('/code', codeController);
app.use('/user', userController);

app.set('views', 'view');
app.set('view engine', 'ejs');

app.listen(PORT, () => {
    console.log('Server started');
});
