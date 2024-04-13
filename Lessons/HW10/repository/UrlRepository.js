import knexClient from "../knex/knexClient.js";
import UrlModelObj from "../knex/objection/UrlModelObj.js";
import appLogger from "appLogger";

const log = appLogger.getLogger('UrlRepository.js');


export default class UrlRepository {
    async add(url) {
        try {
            url.created_at = new Date(url.created_at).toISOString();
            const insertedURL = await UrlModelObj.query().insert({
                code: url.code,
                name: url.name,
                url: url.url,
                created_at: url.created_at,
                visits: url.visits,
                user_id: url.user.user_id,
            });

            log.debug("Inserted url:", insertedURL);
        } catch (error) {
            log.error('Error saving url:', error);
            throw new Error('Failed to save url');
        }
    }

    async addVisit(code) {
        try {
            await UrlModelObj.query()
                .where('code', code)
                .increment('visits', 1);
        } catch (error) {
            log.error('Error adding visit:', error);
            throw new Error('Failed to add visit');
        }
    }

    async get(code) {
        try {
            const url = await UrlModelObj.query().findOne('code', code);
            log.debug('DB BY code' + JSON.stringify(url));
            return url;
        } catch (error) {
            log.error(`Error getting url by code: ${code}`, error);
            throw new Error('Failed to get url by code');
        }
    }

    async getUrlByUser(user) {
        try {
            const urls = await UrlModelObj.query().where('user_id', user.user_id);
            log.debug('DB All url by user' + JSON.stringify(urls));
            return urls;
        } catch (error) {
            log.error('Error getting URLs by user:', error);
            throw new Error('Failed to get URLs by user');
        }
    }
    async getTopFiveVisitedUrlsByUserId(user_id) {
        try {
            const result = await UrlModelObj.query()
                .where('user_id', user_id)
                .orderBy('visits', 'desc')
                .limit(5);
            log.debug(`Top 5 visited URLs for user ${user_id}: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            log.error(`Error getting top 5 visited URLs for user ${user_id}:`, error);
            throw new Error('Failed to get top 5 visited URLs');
        }
    }
    async getTopFiveVisitedUrls() {
        try {
            const result = await UrlModelObj.query()
                .orderBy('visits', 'desc')
                .limit(5);
            log.debug(`Top 5 visited URL: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            log.error(`Error getting top 5 visited URLs`, error);
            throw new Error('Failed to get top 5 visited URLs');
        }
    }

    async getAll() {
        try {
            const result = await UrlModelObj.query();
            console.log('DB All url' + JSON.stringify(result));
            return result;
        } catch (error) {
            console.error('Error getting all url:', error);
            throw new Error('Failed to get all url');
        }
    }
}
