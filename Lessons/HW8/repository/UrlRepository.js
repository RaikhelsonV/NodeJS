import {pool} from '../PostgreSQL/postgreSQL_Pool.js';
import {queries} from '../PostgreSQL/queries.js';

export default class UrlRepository {
    async add(url) {
        const client = await pool.connect();
        try {
            const query = queries.INSERT_URL;
            const values = [
                url.code,
                url.name,
                url.url,
                url.created_time,
                url.visits,
                url.user.user_id,
            ];
            await client.query(query, values);

        } catch (error) {
            console.error('Error saving url:', error);
            throw new Error('Failed to save url');
        } finally {
            client.release();
        }
    }

    async addVisit(code) {
        const client = await pool.connect();
        try {
            const query = queries.ADD_VISIT;
            await client.query(query, [code]);
        } catch (error) {
            console.error('Error adding visit:', error);
            throw new Error('Failed to add visit');
        } finally {
            client.release();
        }
    }

    async get(code) {
        const client = await pool.connect();
        try {
            const query = queries.SELECT_URL_BY_CODE;
            const result = await client.query(query, [code]);
            console.log('DB BY code' + JSON.stringify(result.rows[0]));
            return result.rows[0];
        } catch (error) {
            console.error(`Error getting url by code: ${code}`, error);
            throw new Error('Failed to get url by code');
        } finally {
            client.release();
        }
    }

    async getUrlByUser(user) {
        const client = await pool.connect();
        try {
            const query = queries.SELECT_URLS_BY_USER;
            const result = await client.query(query, [user.user_id]);
            console.log('DB All url by user' + JSON.stringify(result.rows));
            return result.rows;
        } catch (error) {
            console.error('Error getting URLs by user:', error);
            throw new Error('Failed to get URLs by user');
        } finally {
            client.release();
        }
    }

    async getAll() {
        const client = await pool.connect();
        try {
            const query = queries.SELECT_ALL_URLS;
            const result = await client.query(query);
            console.log('DB All url' + JSON.stringify(result.rows));
            return result.rows;
        } catch (error) {
            console.error('Error getting all url:', error);
            throw new Error('Failed to get all url');
        } finally {
            client.release();
        }
    }
}
