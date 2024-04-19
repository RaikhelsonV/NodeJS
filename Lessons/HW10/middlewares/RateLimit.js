import config from '../config.js';
import appLogger from "appLogger";
import {sendRateLimitByCode} from "../webSocket.js";
import UrlService from "../services/UrlService.js";

const log = appLogger.getLogger('RateLimit.js');

export default class RateLimit {

    constructor(redisClient) {
        this.redisClient = redisClient;
        this.urlService = new UrlService();
    }

    async checkRateLimit(keys, resourceType) {
        log.info('Start rate limit')
        log.info('keys, resourceType: ' + JSON.stringify(keys, resourceType));
        try {
            const {duration, limit} = config.rateLimits[resourceType];
            log.debug('duration,limit: ' + duration, limit)
            for (const key of Object.values(keys)) {
                log.debug('key: ' + key)
                await this.redisClient.incr(key);
                await this.redisClient.expire(key, duration);
                const count = parseInt(await this.redisClient.get(key));
                console.log("Count" + count)
                if (count >= limit) return false;
            }
            return true;

        } catch (error) {
            log.error('Error checking rate limit:', error);
            return false;
        }
    }


    async deleteRateLimitByUserId(userId) {
        const userKey = `rateLimitUserId:${userId}`;

        try {
            await this.redisClient.del(userKey);
            console.log(`Rate limits deleted for userId: ${userId}`);
        } catch (error) {
            console.error('Error deleting rate limits:', error);
            throw error;
        }
    }

    async deleteRateLimitByUrlCode(user_id, code) {
        console.log("DELLLLLLLLLLLLLLL", user_id, code)
        const urlKey = `rateLimitCodeUrl:/${code}`;

        try {
            await this.redisClient.del(urlKey);
            await this.getLimitsListByUser(user_id);

            console.log(`Rate limits deleted for code: ${code}`);
        } catch (error) {
            console.error('Error deleting rate limits:', error);
            throw error;
        }
    }

    async deleteRateLimitByIP(ip) {
        console.log("deleteRateLimitByIP " + JSON.stringify(ip.ip_address))
        const ipKey = `rateLimitIP:${ip.ip_address}`;
        console.log(ipKey)
        try {
            await this.redisClient.del(ipKey);

            console.log(`Rate limits deleted for ip: ${ip}`);
        } catch (error) {
            console.error('Error deleting rate limits:', error);
            throw error;
        }
    }


    async getLimitsListByUser(user_id) {
        const allUrlsByUser = await this.urlService.getUrlsByUserId(user_id)
        const limitsList = [];

        for (const url of allUrlsByUser) {

            console.log("FirstUrl: " + JSON.stringify(url)); // Пример операции с URL
            let limitByCode = await this.getValueByKey(url.code)

            const {duration, limit} = config.rateLimits["url"];

            let percentage = (limitByCode / limit) * 100;
            if (isNaN(percentage) || !isFinite(percentage)) {
                percentage = 0;
            } else {
                percentage = Math.min(100, Math.max(0, percentage));
            }
            const limitInfo = {code: url.code, limit: limitByCode, percentage: percentage.toFixed(0)};

            limitsList.push(limitInfo);
        }

        console.log(limitsList);
        sendRateLimitByCode(limitsList)

        return limitsList;
    }

    async getValueByKey(code) {
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        console.log("aaaa")
        const urlKey = `rateLimitCodeUrl:/${code}`;
        try {
            const limit = await this.redisClient.get(urlKey);
            return limit;
        } catch (error) {
            log.error('Error getting value by key:', error);
            throw error;
        }
    }

}
