import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export default class PasswordService {

    static async hashPassword(password) {
        return await bcrypt.hash(password, SALT_ROUNDS);
    }

    static async comparePasswords(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}