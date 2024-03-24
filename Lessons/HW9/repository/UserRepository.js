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
        const query = queries.SELECT_USER_BY_ID;
        const result = await client.query(query, [userId]);
        console.log('DB' + result.rows[0]);
        return result.rows[0];
    }

    getUserByName(name) {
        for (const user of users.values()) {
            if (user.name === name) {
                return user;
            }
        }
        return null;
    }

    getAll() {
        return [...users.values()];
    }
}
