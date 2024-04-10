import config from '../config.js';
import appLogger from "appLogger";

const log = appLogger.getLogger('RateLimit.js');

export default class RateLimit {

    constructor(redisClient) {
        this.redisClient = redisClient;
    }

    async checkRateLimit(keys, resourceType) {
        log.info('Start rate limit')
        try {
            log.debug(config.rateLimits)
            const {duration, limit} = config.rateLimits[resourceType];
            log.debug('duration,limit' + duration, limit)
            for (const key of Object.values(keys)) {
                log.debug('key' + key)
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
}
