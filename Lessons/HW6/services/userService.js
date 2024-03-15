import { add as addUser } from '../models/userStorage.js';

function createUser(userData) {
    addUser(userData);
    return userData;
}

export { createUser };
