import {Router} from 'express';
import UrlService from '../services/urlService.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import RateLimit from '../middlewares/RateLimit.js';
import appLogger from "appLogger";

const log = appLogger.getLogger('CodeController.js');

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
            const urlData = await this.urlService.getUrlInfo(code);

            log.info(JSON.stringify(urlData));

            if (urlData) {
                await this.urlService.addVisit(code);
                res.redirect(302, urlData.url);
            } else {
                res.status(404).send('Not Found');
            }
        });
    };

    rateLimitMiddleware = async (req, res, next) => {
        const userId = req.user.user_id;
        const urlCode = req.url;
        log.info('ID' + req.user.user_id, 'code' + req.url);
        const keys = {
            userRequestsKey: `rateLimitUserId:${userId}`,
            urlRequestsKey: `rateLimitCodeUrl:${urlCode}`
        };

        const isUserRateLimited = await this.rateLimit.checkRateLimit(keys, "user");
        const isUrlRateLimited = await this.rateLimit.checkRateLimit(keys, "url");
        if (!isUserRateLimited || !isUrlRateLimited) {
            res.status(429).send('Rate Limit Exceeded');
            return;
        }

        next();
    };
}
