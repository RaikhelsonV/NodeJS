export default class UserModel {
    userId;
    name;
    password;
    created_time;

    constructor(userId, name, password) {
        this.userId = userId;
        this.name = name;
        this.password = password;
        this.created_time = new Date();
    }
}
