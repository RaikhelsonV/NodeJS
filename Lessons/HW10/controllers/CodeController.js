import {Router} from 'express';
import UrlService from '../services/urlService.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import RateLimit from '../middlewares/RateLimit.js';
import appLogger from "appLogger";
import {sendVisitsUpdate, sendTopFiveByUser, sendTopFive} from "../webSocket.js";
import requestIp from 'request-ip';
import { publicIpv4 } from 'public-ip';

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

            console.log("Code Url Data:", JSON.stringify(urlData));

            if (!urlData) {
                res.status(404).send('Not Found');
                return;
            }

            if (!urlData.enabled) {
                res.status(404).send('Link is not active');
                return;
            }


            if (urlData.enabled === true) {

                await this.urlService.addVisit(code);
                res.redirect(302, urlData.url);

                if (urlData.type === "one_time"){
                   await this.urlService.updateEnabledStatus(code, false);
                }

                const urlLastData = await this.urlService.getUrlInfo(code);
                sendVisitsUpdate(urlLastData);
                const urlsByUser = await this.urlService.getTopFiveUrlsByUser(urlData.user_id)
                sendTopFiveByUser(urlsByUser)
                const urls = await this.urlService.getTopFiveUrls()
                sendTopFive(urls)
            }

        });
    };

    rateLimitMiddleware = async (req, res, next) => {
        console.log(JSON.stringify(req.user));
        const userId = req.user.user_id;
        const urlCode = req.url;

        try {
            const ipAddress = req.ip;
            console.log("IP: " + ipAddress);

            const IP = await publicIpv4();
            console.log("Public IPv4:", IP);

            const keys = {
                userRequestsKey: `rateLimitUserId:${userId}`,
                urlRequestsKey: `rateLimitCodeUrl:${urlCode}`,
                ipRequestsKey: `rateLimitIP:${IP}`,
            };

            const isUserRateLimited = await this.rateLimit.checkRateLimit(keys, "user");
            const isUrlRateLimited = await this.rateLimit.checkRateLimit(keys, "url");
            const isIPRateLimited = await this.rateLimit.checkRateLimit(keys, "ip");

            if (!isUserRateLimited || !isUrlRateLimited || !isIPRateLimited) {
                res.status(429).send('Rate Limit Exceeded');
                return;
            }

            next();
        } catch (error) {
            console.error("An error occurred:", error);
            res.status(500).send('Internal Server Error');
        }
    };


}
