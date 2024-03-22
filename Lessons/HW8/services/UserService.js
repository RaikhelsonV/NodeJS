import UserRepository from '../repository/userRepository.js';
import UserModel from '../models/userModel.js';
import {generatedUserId} from '../utils/randomCode.js';

export default class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    create(name, password) {
        const user = new UserModel(generatedUserId('user'), name, password);
        this.userRepository.save(user);
        console.log('aaa' + JSON.stringify(user));
        return user;
    }

    getUsersPublicData() {
        const users = this.userRepository.getAll();
        const result = [];
        for (const user of users) {
            result.push({
                id: user.userId,
                name: user.name,
                created_time: user.created_time,
            });
        }
        for (const [index, user] of result.entries()) {
            console.log(`Index: ${index}, Value: ${JSON.stringify(user)}`);
        }
        return result;
    }
}
