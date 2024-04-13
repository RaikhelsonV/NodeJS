import UserRepository from '../repository/userRepository.js';
import UserModel from '../models/userModel.js';
import {generatedUserId} from '../utils/randomCode.js';
import {UserRoles} from '../models/userRoles.js';
import PasswordService from "./PasswordService.js";
import appLogger from "appLogger";

const log = appLogger.getLogger('UserService.js');

export default class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async create(name, surname, password, email, role) {
        const existingUsers = await this.userRepository.getAll();

        let userRole = UserRoles.USER;
        if (existingUsers.length === 0) {
            userRole = UserRoles.ADMIN;
        }
        if (role === UserRoles.ADMIN) {
            userRole = role;
        }
        const hashedPassword = await PasswordService.hashPassword(password);

        const user = new UserModel(generatedUserId('user'), name, surname, hashedPassword, email, userRole);

        log.debug(JSON.stringify(user))
        await this.userRepository.save(user);
        return user;
    }

    async delete(user_id) {
        try {
            await this.userRepository.deleteUserAndLinks(user_id);
        } catch (error) {
            log.error('Error,' + error);
            throw new Error('Error');
        }
    }

    async authenticate(email, password) {
        try {
            const user = await this.userRepository.getUserByEmail(email);

            if (!user) {
                return {error: 'User not found'};
            } else {
                const passwordMatch = await PasswordService.comparePasswords(password, user.password);
                if (passwordMatch) {
                    return user;
                } else {
                    return {error: 'Authentication failed'};
                }
            }
        } catch (error) {
            console.error('Error authenticating user:', error);
            throw new Error('Error authenticating user');
        }

    }

    async getUsersPublicData() {
        const users = await this.userRepository.getAll();
        const result = [];
        for (const user of users) {
            log.debug("getUsersPublicData" + user.user_id, user.name, user.surname, user.email, user.role, user.created_at);
            result.push({
                user_id: user.user_id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
            });
        }
        return result;
    }
}
