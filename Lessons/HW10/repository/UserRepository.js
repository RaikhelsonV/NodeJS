import knexClient from "../knex/knexClient.js";
import UserModelObj from "../knex/objection/UserModelObj.js";
import UrlModelObj from "../knex/objection/UrlModelObj.js";
import appLogger from "appLogger";

const log = appLogger.getLogger('UserRepository.js');

export default class UserRepository {
    async save(user) {
        log.debug("user: " + JSON.stringify(user))
        try {
            user.created_at = new Date(user.created_at).toISOString();
            const insertedUser = await UserModelObj.query().insert(user);
            log.debug("Inserted user:", insertedUser);
        } catch (error) {
            log.error('Error saving user:', error);
            throw new Error('Failed to save user');
        }
    }

    async deleteUserAndLinks(user_id) {
        log.debug("User id for delete: " + user_id);
        try {
            await knexClient.transaction(async (trx) => {
                const hasLinks = await UrlModelObj.query(trx).where('user_id', user_id).first();
                if (!hasLinks) {
                    console.log(`No links found for user ${user_id}`);
                    await UserModelObj.query(trx).delete().where('user_id', user_id);
                    return;
                } else {
                    console.log(`User has links ${user_id}`);
                    await UrlModelObj.query(trx).delete().where('user_id', user_id);
                    await UserModelObj.query(trx).delete().where('user_id', user_id);
                }
            });
        } catch (error) {
            log.error('Error deleting user and links:', error);
            throw new Error('Failed to delete user and links');
        }
    }

    async getUserByEmail(email) {
        try {
            const result = await UserModelObj.query().findOne({email});
            if (!result) {
                throw new Error('User not found');
            }
            log.debug('DB BY Email  ' + JSON.stringify(result));
            return result || null;
        } catch (error) {
            log.error(`Error getting user by email: ${email}`, error);
            throw new Error('Failed to get user by email');
        }
    }


    async getUserById(user_id) {
        try {
            const result = await knexClient.table('users')
                .where({user_id: user_id}).first();
            log.debug('DB BY id' + JSON.stringify(result));
            return result;
        } catch (error) {
            log.error(`Error getting user by id: ${user_id}`, error);
            throw new Error('Failed to get user by id');
        }
    }

    async getUserByName(name) {
        try {
            const result = await UserModelObj.query().findOne({name});
            log.debug('DB BY NAME' + JSON.stringify(result));
            return result;
        } catch (error) {
            log.error(`Error getting user by name: ${name}`, error);
            throw new Error('Failed to get user by name');
        }
    }


    async getAll() {
        try {
            const result = await UserModelObj.query();
            log.debug('DB All' + JSON.stringify(result));
            return result;
        } catch (error) {
            log.error('Error getting all users:', error);
            throw new Error('Failed to get all users');
        }

    }
}
