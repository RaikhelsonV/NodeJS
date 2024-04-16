import config from '../config.js';
import appLogger from "appLogger";

const log = appLogger.getLogger('RateLimit.js');

export default class RateLimit {

    constructor(redisClient) {
        this.redisClient = redisClient;
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

    async deleteRateLimitByUrlCode(code) {
        const urlKey = `rateLimitCodeUrl:/${code}`;

        try {
            await this.redisClient.del(urlKey);

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

}
