import config from '../config.js';

export default class RateLimit {
    constructor(redisClient) {
        this.redisClient = redisClient;
    }

    async checkRateLimit(userId, urlCode) {
        try {
            const userRequestsKey = `rateLimitUserId:${userId}`;
            const urlRequestsKey = `rateLimitCodeUrl:${urlCode}`;
            const currentTime = Math.floor(Date.now() / 1000);

            await this.redisClient.rPush(
                userRequestsKey,
                currentTime.toString()
            );
            await this.redisClient.rPush(
                urlRequestsKey,
                currentTime.toString()
            );

            await this.redisClient.expire(
                userRequestsKey,
                config.rateLimits.user.duration
            );
            await this.redisClient.expire(
                urlRequestsKey,
                config.rateLimits.url.duration
            );

            const userCount = await this.redisClient.lLen(userRequestsKey);
            const urlCount = await this.redisClient.lLen(urlRequestsKey);
            console.log('userCount:', userCount, ' urlCount: ', urlCount);

            if (
                userCount >= config.rateLimits.user.limit ||
                urlCount >= config.rateLimits.url.limit
            ) {
                return 429;
            }
            return 200;
        } catch (error) {
            console.error('Error checking rate limit:', error);
            return 500;
        }
    }
}
