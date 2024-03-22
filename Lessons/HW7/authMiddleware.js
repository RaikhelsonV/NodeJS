import UserRepository from './repository/userRepository.js';

export default (req, res, next) => {
    const auth = req.header('Authorization');
    console.log('AUTH' + auth);
    if (auth?.startsWith('Basic')) {
        const encodedCredentials = auth.split(' ')[1];

        const decodedCredentials = Buffer.from(
            encodedCredentials,
            'base64'
        ).toString('utf-8');

        const [username, password] = decodedCredentials.split(':');

        console.log('Username:', username);
        console.log('Password:', password);

        const user = new UserRepository().getUserByName(username);

        if (user && user.password === password) {
            req.user = { ...user, id: user.id };
            console.log('REQ USER AUTOR' + req.user);

            req.session.user = { ...user, id: user.id };
            next();
            return;
        }
        return res.status(401).end('Invalid username or password');
    }

    if (req.session.user) {
        req.user = req.session.user;
        next();
    } else {
        return res.status(401).end('Auth header not provided');
    }
};
