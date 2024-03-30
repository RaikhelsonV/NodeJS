import { Router } from 'express';
import UrlService from '../services/urlService.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import RateLimit from '../middlewares/RateLimit.js';

export default class CodeController extends Router {
    constructor(redisClient) {
        super();
        this.urlService = new UrlService();
        this.redisClient = redisClient;
        this.rateLimit = new RateLimit(this.redisClient);
        this.init();
    }

    init = () => {
        this.use(authMiddleware);
        this.use(this.rateLimitMiddleware)
        this.get('/:code', async (req, res) => {
            const code = req.params.code;
            const urlData = this.urlService.getUrlInfo(code);

            console.log('url' + JSON.stringify(urlData));

            if (urlData) {
                this.urlService.addVisit(code);
                res.redirect(302, urlData.url);
            } else {
                res.status(404).send('Not Found');
            }
        });
    };

    rateLimitMiddleware = async (req, res, next) => {
        const userId = req.user.userId;
        const urlCode = req.url;
        console.log('ID' + req.user.userId, 'code' + req.url);
        const isRateLimited = await this.rateLimit.checkRateLimit(
            userId,
            urlCode
        );

        if (!isRateLimited) {
            res.status(429).send('Rate Limit Exceeded');
            return;
        }

        next();
    };
}
