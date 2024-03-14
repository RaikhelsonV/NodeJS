import { get as getUser } from './models/userStorage.js';

export default (req, res, next) => {
    const auth = req.header('Authorization');
    console.log(auth);
    if (auth?.startsWith('Basic')) {
        const encodedCredentials = auth.split(' ')[1];

        const decodedCredentials = Buffer.from(
            encodedCredentials,
            'base64'
        ).toString('utf-8');

        const [username, password] = decodedCredentials.split(':');

        console.log('Username:', username);
        console.log('Password:', password);
        const user = getUser(username);

        if (user && user.password === password) {
            req.user = user;
            next();
            return;
        }
    }
    res.status(401).end('Auth header not provided');
};
