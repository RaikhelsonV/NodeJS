import UserService from '../services/userService.js';
import UrlService from "../services/UrlService.js";
import {Router} from 'express';
import {jsonParser, urlEncodedParser} from '../middlewares/authMiddleware.js';
import appLogger from "appLogger";


const log = appLogger.getLogger('UserController.js');

export default class UserController extends Router {
    constructor() {
        super();
        this.userService = new UserService();
        this.urlService = new UrlService();
        this.init();
    }

    init = () => {
        this.get('/', async (req, res) => {
            res.render('login.ejs');
        });

        this.post('/login', urlEncodedParser, async (req, res) => {
            const {email, password} = req.body;
            console.log(email, password)
            try {
                const user = await this.userService.authenticate(email, password);

                if (user) {
                    req.session.user = {name: user.name, email: user.email, password: user.password, role: user.role};
                    if (user.role === 'admin') {
                        res.redirect('/admin');
                    } else {
                        res.redirect('/url');
                    }
                } else {
                    res.render('login.ejs', {error: 'Invalid username or password'});
                }
            } catch (error) {
                log.error('Error logging in:', error);
                res.status(500).send('Error logging in');
            }
        });


        this.get('/registration', async (req, res) => {
            res.render('registration.ejs');
        });


        this.post('/registration', urlEncodedParser, async (req, res) => {
            const {name, surname, password, email, role} = req.body;
            const newUser = await this.userService.create(name, surname, password, email, role);

            req.session.user = {name: name, email: email, password: password, role: newUser.role};

            log.debug(JSON.stringify(newUser))
            if (newUser.role === 'admin') {
                res.redirect('/admin');
            } else {
                res.redirect('/url');
            }
        });

        this.post('/logout', (req, res) => {
            console.log("LOGOUT")
            req.session.destroy((err) => {
                if (err) {
                    log.error('Error logging out:', err);
                    res.status(500).send('Error logging out');
                } else {
                    console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                    res.clearCookie('connect.sid');
                    res.redirect('/user');
                }
            });
        });


        this.get('/all', jsonParser, async (req, res) => {
            const users = await this.userService.getUsersPublicData();
            res.json(users);
        });

        this.post('/create', jsonParser, async (req, res) => {
            const {name, surname, password, email} = req.body;
            log.info(name, password);
            const newUser = await this.userService.create(name, surname, password, email);
            res.json(newUser);
        });
    };
}
