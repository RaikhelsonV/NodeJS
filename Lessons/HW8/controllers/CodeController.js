import { Router } from 'express';
import UrlService from '../services/urlService.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import RateLimit from '../middlewares/RateLimit.js';

export default class CodeController extends Router {
    constructor(redisClient) {
        super();
        this.urlService = new UrlService();
        this.redisClient = redisClient;
        this.init();
    }

    init = () => {
        this.use(authMiddleware);
        const rateLimit = new RateLimit(this.redisClient);
        this.use(rateLimit);

        this.get('/:code', async (req, res) => {
            const code = req.params.code;
            const urlData = this.urlService.getUrlInfo(code);

            console.log('url' + JSON.stringify(urlData));
            console.log('ID' + req.user.userId, 'code' + req.url);

            const userId = req.user.userId;
            const urlCode = req.url;
            const isRateLimited = await this.rateLimit.checkRateLimit(
                userId,
                urlCode
            );

            if (!isRateLimited) {
                res.status(429).send('Rate Limit Exceeded');
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
