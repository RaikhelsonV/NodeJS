import config from '../config.js';

export default class RateLimit {

    constructor(redisClient) {
        this.redisClient = redisClient;
    }

    async checkRateLimit(keys, resourceType) {
        console.log('start rate limit')
        try {
            console.log(config.rateLimits)
            const {duration, limit} = config.rateLimits[resourceType];
            console.log('duration,limit' + duration, limit)
            for (const key of Object.values(keys)) {
                console.log('key' + key)
                await this.redisClient.incr(key);
                await this.redisClient.expire(key, duration);
                const count = parseInt(await this.redisClient.get(key));
                if (count >= limit) return false;
            }
            return true;

        } catch (error) {
            console.error('Error checking rate limit:', error);
            return false;
        }
    }
}
