import { client } from '../PostgreSQL/PostgreSQL_Client.js';
import { queries } from '../PostgreSQL/queries.js';
const storage = new Map();

export default class UrlRepository {
    async add(url) {
        console.log('URL' + JSON.stringify(url));
        try {
            const query = queries.INSERT_URL;
            const values = [
                url.code,
                url.name,
                url.url,
                url.created_time,
                url.userId,
            ];
            await client.query(query, values);
        } catch (error) {
            console.error('Error saving url:', error);
            throw new Error('Failed to save url');
        }
    }

    async addVisit(code) {
        try {
            const query = queries.ADD_VISIT;
            await client.query(query, [code]);
        } catch (error) {
            console.error('Error adding visit:', error);
            throw new Error('Failed to add visit');
        }
    }

    async get(code) {
        try {
            const query = queries.SELECT_URL_BY_CODE;
            const result = await client.query(query, [code]);
            console.log('DB BY code' + JSON.stringify(result.rows[0]));
            return result.rows[0];
        } catch (error) {
            console.error(`Error getting url by code: ${code}`, error);
            throw new Error('Failed to get url by code');
        }
    }

    async getUrlByUser(user) {
        try {
            const query = queries.SELECT_URLS_BY_USER;
            const result = await client.query(query, [user.userId]);
            return result.rows;
        } catch (error) {
            console.error('Error getting URLs by user:', error);
            throw new Error('Failed to get URLs by user');
        }
    }

    getByUserId(userId) {
        return this.urls.filter((urlData) => urlData.user.userId === userId);
    }
}
