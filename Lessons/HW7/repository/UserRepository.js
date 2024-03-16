const users = new Map();

export default class UserRepository {
    save(user) {
        users.set(user.userId, user);
    }

    getUserById(userId) {
        return users.get(userId);
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
