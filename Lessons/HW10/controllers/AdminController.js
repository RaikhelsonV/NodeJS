import UserService from '../services/userService.js';
import UrlService from "../services/UrlService.js";
import {Router} from 'express';
import {urlEncodedParser} from '../middlewares/authMiddleware.js';
import appLogger from "appLogger";
import authMiddleware from "../middlewares/authMiddleware.js";


const log = appLogger.getLogger('UserController.js');

export default class AdminController extends Router {
    constructor() {
        super();
        this.userService = new UserService();
        this.urlService = new UrlService();
        this.use(authMiddleware);
        this.init();
    }

    init = () => {
        this.get('/', async (req, res) => {
            console.log("SSSSSSSSSSSSSSSSSSSSSSSSS" + JSON.stringify(req.session))
            console.log(JSON.stringify(req.session.user))
            if (req.session.user && req.session.user.role === 'admin') {
                const users = await this.userService.getUsersPublicData();
                for (const user of users) {
                    console.log(user)
                    user.urls = await this.urlService.getUrlsByUser(user)
                }
                res.render('adminPanel.ejs', {users});
            } else {
                res.redirect('/user');
            }
        });

        this.post('/', urlEncodedParser, async (req, res) => {
            try {
                const {name, surname, password, email, role} = req.body;
                console.log("ROLE" + role)
                const newUser = await this.userService.create(name, surname, password, email, role);

                log.debug(JSON.stringify(newUser))
                if (newUser.role === 'admin') {
                    res.redirect('/admin');
                } else {
                    res.redirect('/url');
                }
            } catch (error) {
                if (error.message === 'Failed to save user') {
                    res.status(400).render('login.ejs', {error: 'Error registering user'})
                } else {
                    res.status(500).render('adminPanel.ejs', {error: 'Error registering user'});
                }

            }
        });

        this.post('/delete', urlEncodedParser, async (req, res) => {
            console.log("aaaaaaaaaaaaaaaa" + JSON.stringify(req.body))
            const user_id = req.body.user_id;
            console.log("vvvvvvvvvvvvvvv" + JSON.stringify(user_id))
            try {
                await this.userService.delete(user_id);
                res.redirect('/admin');
            } catch (error) {
                log.error('Error deleting user:', error);
                res.status(500).send('Error deleting user');
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


    };
}
