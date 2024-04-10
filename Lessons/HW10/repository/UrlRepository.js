import knexClient from "../knex/knexClient.js";
import UrlModelObj from "../knex/objection/UrlModelObj.js";

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

            console.log("Inserted url:", insertedURL);
        } catch (error) {
            console.error('Error saving url:', error);
            throw new Error('Failed to save url');
        }
    }

    async addVisit(code) {
        try {
            await UrlModelObj.query()
                .where('code', code)
                .increment('visits', 1);
        } catch (error) {
            console.error('Error adding visit:', error);
            throw new Error('Failed to add visit');
        }
    }

    async get(code) {
        try {
            const url = await UrlModelObj.query().findOne('code', code);
            console.log('DB BY code' + JSON.stringify(url));
            return url;
        } catch (error) {
            console.error(`Error getting url by code: ${code}`, error);
            throw new Error('Failed to get url by code');
        }
    }

    async getUrlByUser(user) {
        try {
            const urls = await UrlModelObj.query().where('user_id', user.user_id);
            console.log('DB All url by user' + JSON.stringify(urls));
            return urls;
        } catch (error) {
            console.error('Error getting URLs by user:', error);
            throw new Error('Failed to get URLs by user');
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
