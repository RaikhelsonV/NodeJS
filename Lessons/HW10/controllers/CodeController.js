import {Router} from 'express';
import UrlService from '../services/urlService.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import RateLimit from '../middlewares/RateLimit.js';
import appLogger from "appLogger";
import {
    sendVisitsUpdate,
    sendTopFiveByUser,
    sendTopFive,
    sendAllUserLinksCountUpdate,
    sendRateLimitByCode
} from "../webSocket.js";
import {publicIpv4} from 'public-ip';
import config from "../config.js";


const log = appLogger.getLogger('CodeController.js');

export default class CodeController extends Router {
    constructor(redisClient, rateLimit) {
        super();
        this.urlService = new UrlService();
        this.redisClient = redisClient;
        this.rateLimit = rateLimit;
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

                if (urlData.type === "one_time") {
                    await this.urlService.updateEnabledStatus(code, false);
                }

                await this.sendDataToDashBoard(urlData, code)

            }

        });
    };

    sendDataToDashBoard = async (urlData, code) => {
        const urlLastData = await this.urlService.getUrlInfo(code);
        sendVisitsUpdate(urlLastData);

        const topUrlsByUser = await this.urlService.getTopFiveUrlsByUser(urlData.user_id)
        sendTopFiveByUser(topUrlsByUser)

        const urls = await this.urlService.getTopFiveUrls()
        sendTopFive(urls)

        const allUrlsByUser = await this.urlService.getUrlsByUserId(urlData.user_id)
        sendAllUserLinksCountUpdate(allUrlsByUser.length)

        const limitsList = await this.getLimitsList(allUrlsByUser);
        sendRateLimitByCode(limitsList)

    }

    getLimitsList = async (allUrlsByUser) => {
        const limitsList = [];

        for (const url of allUrlsByUser) {

            console.log(url); // Пример операции с URL
            let limitByCode = await this.rateLimit.getValueByKey(url.code)

            const {duration, limit} = config.rateLimits["url"];
            log.debug('duration,limit: ' + duration, limit)
            console.log(typeof limitByCode)
            console.log(typeof  limit)
            console.log(limitByCode)
            console.log(limit)
            if (limitByCode !== null && limitByCode.toString() === limit.toString()) {
                console.log("ON LOMIT: " + limitByCode, limit)
                limitByCode = "Rate limit exceeded"
            }
            const limitInfo = {code: url.code, limit: limitByCode};
            limitsList.push(limitInfo);
        }

        console.log(limitsList);
        return limitsList;
    }


    rateLimitMiddleware = async (req, res, next) => {
        console.log("Call rateLimitMiddleware" + JSON.stringify(req.user));
        const userId = req.user.user_id;
        const urlCode = req.url;

        try {
            const IP = await publicIpv4();
            console.log("Public IPv4:", IP);

            const userKeys = {userRequestsKey: `rateLimitUserId:${userId}`};
            const urlKeys = {urlRequestsKey: `rateLimitCodeUrl:${urlCode}`};
            const ipKeys = {ipRequestsKey: `rateLimitIP:${IP}`}

            const isUserRateLimited = await this.rateLimit.checkRateLimit(userKeys, "user");
            const isUrlRateLimited = await this.rateLimit.checkRateLimit(urlKeys, "url");
            const isIPRateLimited = await this.rateLimit.checkRateLimit(ipKeys, "ip");

            if (!isUserRateLimited || !isUrlRateLimited || !isIPRateLimited) {
                res.status(429).send('Rate Limit Exceeded');
                return;
            }

            next();
        } catch
            (error) {
            console.error("An error occurred:", error);
            res.status(500).send('Internal Server Error');
        }
    };

}
