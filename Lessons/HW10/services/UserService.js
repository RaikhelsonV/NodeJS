import UserRepository from '../repository/userRepository.js';
import UserModel from '../models/userModel.js';
import {generatedUserId} from '../utils/randomCode.js';

export default class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async create(name, password) {
        const user = new UserModel(generatedUserId('user'), name, password);
        console.log('service user ' + JSON.stringify(user))
        await this.userRepository.save(user);
        return user;
    }

    async getUsersPublicData() {
        const users = await this.userRepository.getAll();
        const result = [];
        for (const user of users) {
            console.log(user.user_id, user.name, user.created_at,)
            result.push({
                id: user.user_id,
                name: user.name,
                created_at: user.created_at,
            });
        }
        for (const [index, user] of result.entries()) {
            console.log(`Index: ${index}, Value: ${JSON.stringify(user)}`);
        }
        return result;
    }
}
