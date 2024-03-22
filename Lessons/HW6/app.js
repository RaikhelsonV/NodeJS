import express from 'express';
import urlController from './controllers/urlController.js';
import userController from './controllers/userController.js';
import codeController from './controllers/codeController.js';

const app = express();
const PORT = 3001;

app.use('/url', urlController);
app.use('/code', codeController);
app.use('/user', userController);

app.listen(PORT, () => {
    console.log('Server started');
});
