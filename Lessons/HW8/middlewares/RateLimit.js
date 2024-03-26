import config from '../config.js';

export default class RateLimit {
    constructor(redisClient) {
        this.redisClient = redisClient;
    }

    async checkRateLimit(userId, urlCode) {
        try {
            const userRequestsKey = `rateLimitUserId:${userId}`;
            const urlRequestsKey = `rateLimitCodeUrl:${urlCode}`;

            await this.redisClient.incr(userRequestsKey);
            await this.redisClient.incr(urlRequestsKey);

            await this.redisClient.expire(
                userRequestsKey,
                config.rateLimits.user.duration
            );
            await this.redisClient.expire(
                urlRequestsKey,
                config.rateLimits.url.duration
            );

            const userCount = parseInt(
                await this.redisClient.get(userRequestsKey)
            );
            const urlCount = parseInt(
                await this.redisClient.get(urlRequestsKey)
            );
            console.log('userCount:', userCount, ' urlCount: ', urlCount);

            if (
                userCount >= config.rateLimits.user.limit ||
                urlCount >= config.rateLimits.url.limit
            ) {
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error checking rate limit:', error);
            return false;
        }
    }
}
