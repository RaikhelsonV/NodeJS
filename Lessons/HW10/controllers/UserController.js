import UserService from '../services/userService.js';
import {Router} from 'express';
import {jsonParser, urlEncodedParser} from '../middlewares/authMiddleware.js';

export default class UserController extends Router {
    constructor() {
        super();
        this.userService = new UserService();
        this.init();
    }

    init = () => {
        this.get('/', async (req, res) => {
            const users = await this.userService.getUsersPublicData();
            users.forEach(user => {
                console.log(user);
            });
            res.render('users.ejs', {users});
        });

        this.get('/all', jsonParser, async (req, res) => {
            const users = await this.userService.getUsersPublicData();
            res.json(users);
        });

        this.post('/create', jsonParser, async (req, res) => {
            const {name, password} = req.body;
            console.log(name, password);
            const newUser = await this.userService.create(name, password);
            res.json(newUser);
        });

        this.post('/createUser', urlEncodedParser, async (req, res) => {
            const {name, password} = req.body;
            const newUser = await this.userService.create(name, password);
            console.log(JSON.stringify(newUser));
            req.session.user = {name: name, password: password};
            res.redirect('/user');
        });
    };
}
