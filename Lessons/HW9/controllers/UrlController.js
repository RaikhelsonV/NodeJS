import { Router } from 'express';
import UrlService from '../services/urlService.js';
import UserRepository from '../repository/userRepository.js';
import { jsonParser, urlEncodedParser } from '../middlewares/authMiddleware.js';
import authMiddleware from '../middlewares/authMiddleware.js';

export default class UrlController extends Router {
    constructor() {
        super();
        this.urlService = new UrlService();
        this.userRepository = new UserRepository();
        // this.use(authMiddleware);
        this.init();
    }

    init = () => {
        this.post('/add', jsonParser, (req, res) => {
            this.userRepository.getUserByName('Val');
            this.userRepository.getUserById('1');
            this.userRepository.getAll();

            console.log('body:' + JSON.stringify(req.body, req.user));
            const code = this.urlService.addUrl(req.body, req.user);
            res.json({ code });
        });

        this.post('/addUrl', urlEncodedParser, (req, res) => {
            const user = this.userRepository.getUserByName(req.user.name);
            req.user = user;
            const code = this.urlService.addUrl(req.body, req.user);
            res.redirect('/url');
            return;
        });

        this.get('/info/:code', (req, res) => {
            const code = req.params.code;
            const urlData = this.urlService.getUrlInfo(code);
            res.json(urlData);
        });

        this.get('/', (req, res) => {
            console.log(req.user.name, req.user.password);
            const user = this.userRepository.getUserByName(req.user.name);
            const userUrls = this.urlService.getUrlsByUser(user);
            res.render('url', { userUrls });
        });
    };
}
