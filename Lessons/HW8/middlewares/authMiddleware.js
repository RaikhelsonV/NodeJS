import UserRepository from '../repository/userRepository.js';
import express from 'express';

export const jsonParser = express.json();
export const urlEncodedParser = express.urlencoded({extended: true});
export default async (req, res, next) => {
    const auth = req.header('Authorization');
    console.log('AUTH' + auth);
    if (auth?.startsWith('Basic')) {
        console.log('Basic')
        const encodedCredentials = auth.split(' ')[1];

        const decodedCredentials = Buffer.from(
            encodedCredentials,
            'base64'
        ).toString('utf-8');

        const [username, password] = decodedCredentials.split(':');

        console.log('Username:', username);
        console.log('Password:', password);

        const user = await new UserRepository().getUserByName(username);

        if (user && user.password === password) {
            req.user = {...user, id: user.id};
            console.log('REQ USER AUTOR' + JSON.stringify(req.user));

            req.session.user = {...user, id: user.id};
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
