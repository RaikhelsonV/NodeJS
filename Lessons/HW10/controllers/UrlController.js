import {Router} from 'express';
import UrlService from '../services/urlService.js';
import UserService from "../services/UserService.js";
import UserRepository from '../repository/UserRepository.js';
import {jsonParser, urlEncodedParser} from '../middlewares/authMiddleware.js';
import authMiddleware from '../middlewares/authMiddleware.js';

export default class UrlController extends Router {
    constructor() {
        super();
        this.urlService = new UrlService();
        this.userService = new UserService()
        this.userRepository = new UserRepository();
        this.use(authMiddleware);
        this.init();
    }

    init = () => {
        this.post('/add', jsonParser, async (req, res) => {
            const code = await this.urlService.addUrl(req.body, req.user);
            res.json({code});
        });

        this.post('/addUrl', urlEncodedParser, async (req, res) => {
            console.log("get user by name")
            const user = await this.userRepository.getUserByName(req.user.name);
            console.log('url controller + got user: '+JSON.stringify(user));
            console.log("req.user = user;" + JSON.stringify(req.user));
            req.user = user;
            const code = await this.urlService.addUrl(req.body, req.user);
            res.redirect('/url');
            return;
        });

        this.get('/info/:code', async (req, res) => {
            const code = req.params.code;
            const urlData = await this.urlService.getUrlInfo(code);
            res.json(urlData);
        });

        this.get('/', async (req, res) => {
            const user = await this.userRepository.getUserByName(req.user.name);
            const userUrls = await this.urlService.getUrlsByUser(user);
            res.render('url', {userUrls});

        });
    };
}
