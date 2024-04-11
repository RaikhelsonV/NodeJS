import UserRepository from '../repository/userRepository.js';
import UserModel from '../models/userModel.js';
import {generatedUserId} from '../utils/randomCode.js';
import appLogger from "appLogger";

const log = appLogger.getLogger('UserService.js');

export default class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async create(name, password) {
        const user = new UserModel(generatedUserId('user'), name, password);
        log.debug(JSON.stringify(user))
        await this.userRepository.save(user);
        return user;
    }

    async getUsersPublicData() {
        const users = await this.userRepository.getAll();
        const result = [];
        for (const user of users) {
            log.debug(user.user_id, user.name, user.created_at);
            result.push({
                id: user.user_id,
                name: user.name,
                created_at: user.created_at,
            });
        }
        return result;
    }
}
