import express, { Router } from 'express';
import UserService from '../services/userService.js';

export default class UserController extends Router {
    constructor() {
        super();
        this.userService = new UserService();
        this.init();
    }

    init = () => {
        this.get('/', (req, res) => {
            const users = this.userService.getUsersPublicData();
            res.render('users.ejs', { users });
        });

        this.get('/all', express.json(), (req, res) => {
            const users = this.userService.getUsersPublicData();
            res.json(users);
        });

        this.post('/create', express.json(), (req, res) => {
            const { name, password } = req.body;
            console.log(name, password);
            const newUser = this.userService.create(name, password);
            res.json(newUser);
        });

        this.post(
            '/createUser',
            express.urlencoded({ extended: true }),
            (req, res) => {
                const { name, password } = req.body;
                console.log(name, password);
                const newUser = this.userService.create(name, password);
                console.log(JSON.stringify(newUser));
                req.session.user = { name: name, password: password };
                res.redirect('/user');
            }
        );
    };
}
