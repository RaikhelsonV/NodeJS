import express from 'express';
import UrlController from './controllers/urlController.js';
import UserController from './controllers/userController.js';
import CodeController from './controllers/codeController.js';
import session from 'express-session';

const app = express();
const PORT = 3001;

const userController = new UserController();
const urlController = new UrlController();
const codeController = new CodeController();

app.use(
    session({
        secret: '1',
        resave: false,
        saveUninitialized: false,
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
