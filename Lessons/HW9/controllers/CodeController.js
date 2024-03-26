import { Router } from 'express';
import UrlService from '../services/urlService.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import RateLimit from '../middlewares/RateLimit.js';

export default class CodeController extends Router {
    constructor(redisClient) {
        super();
        this.urlService = new UrlService();
        this.use(authMiddleware);
        this.redisClient = redisClient;
        this.rateLimit = new RateLimit(this.redisClient);
        this.init();
    }

    init = () => {
        this.get('/:code', async (req, res) => {
            const code = req.params.code;
            const urlData = this.urlService.getUrlInfo(code);

            console.log('url' + JSON.stringify(urlData));
            console.log('ID' + req.user.userId, 'code' + req.url);

            const userId = req.user.userId;
            const urlCode = req.url;
            const rateLimitResult = await this.rateLimit.checkRateLimit(
                userId,
                urlCode
            );

            if (rateLimitResult === 429) {
                res.status(429).send('Rate Limit Exceeded');
                return;
            } else if (rateLimitResult === 500) {
                res.status(500).send('Internal Server Error');
                return;
            }

            if (urlData) {
                this.urlService.addVisit(code);
                res.redirect(302, urlData.url);
            } else {
                res.status(404).send('Not Found');
            }
        });
    };
}
