import { client } from '../PostgreSQL/PostgreSQL_Client.js';
import { queries } from '../PostgreSQL/queries.js';
const users = new Map();

export default class UserRepository {
    async save(user) {
        try {
            const query = queries.INSERT_USER;
            const values = [
                user.userId,
                user.name,
                user.password,
                user.created_time,
            ];
            await client.query(query, values);
        } catch (error) {
            console.error('Error saving user:', error);
            throw new Error('Failed to save user');
        }
    }

    async getUserById(userId) {
        try {
            const query = queries.SELECT_USER_BY_ID;
            const result = await client.query(query, [userId]);
            console.log('DB BY id' + JSON.stringify(result.rows[0]));
            return result.rows[0];
        } catch (error) {
            console.error(`Error getting user by id: ${userId}`, error);
            throw new Error('Failed to get user by id');
        }
    }

    async getUserByName(name) {
        try {
            const query = queries.SELECT_USER_BY_NAME;
            const result = await client.query(query, [name]);
            console.log('DB BY NAME' + JSON.stringify(result.rows[0]));
            return result.rows[0];
        } catch (error) {
            console.error(`Error getting user by name: ${name}`, error);
            throw new Error('Failed to get user by name');
        }
    }

    async getAll() {
        const query = queries.SELECT_ALL_USERS;
        const result = await client.query(query);
        console.log('DB All' + JSON.stringify(result.rows));
        return result.rows;
    }
}
