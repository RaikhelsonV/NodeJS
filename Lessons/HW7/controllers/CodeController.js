import { Router } from 'express';
import UrlService from '../services/urlService.js';
import authMiddleware from '../authMiddleware.js';

export default class CodeController extends Router {
    constructor() {
        super();
        this.urlService = new UrlService();

        this.use(authMiddleware);

        this.init();
    }
    init = () => {
        this.get('/:code', (req, res) => {
            const code = req.params.code;
            const urlData = this.urlService.getUrlInfo(code);
            console.log('urlaaaata' + urlData);
            if (urlData) {
                this.urlService.addVisit(code);
                res.redirect(302, urlData.url);
            } else {
                res.status(404).send('Not Found');
            }
        });
    };
}
