import knexClient from "../knex/knexClient.js";
import UserModelObj from "../knex/objection/UserModelObj.js";

export default class UserRepository {
    async save(user) {
        console.log("user: " + JSON.stringify(user))
        try {
            user.created_at = new Date(user.created_at).toISOString();
            const insertedUser = await UserModelObj.query().insert(user);
            console.log("Inserted user:", insertedUser);
        } catch (error) {
            console.error('Error saving user:', error);
            throw new Error('Failed to save user');
        }
    }

    async getUserById(user_id) {
        try {
            const result = await knexClient.table('users')
                .where({user_id: user_id}).first();
            console.log('DB BY id' + JSON.stringify(result));
            return result;
        } catch (error) {
            console.error(`Error getting user by id: ${user_id}`, error);
            throw new Error('Failed to get user by id');
        }
    }

    async getUserByName(name) {
        try {
            const result = await UserModelObj.query().findOne({name});
            console.log('DB BY NAME' + JSON.stringify(result));
            return result;
        } catch (error) {
            console.error(`Error getting user by name: ${name}`, error);
            throw new Error('Failed to get user by name');
        }
    }

    async getAll() {
        try {
            const result = await UserModelObj.query();
            console.log('DB All' + JSON.stringify(result));
            return result;
        } catch (error) {
            console.error('Error getting all users:', error);
            throw new Error('Failed to get all users');
        }

    }
}
