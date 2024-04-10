export default class UserModel {
    user_id;
    name;
    password;
    created_at;

    constructor(user_id, name, password) {
        this.user_id = user_id;
        this.name = name;
        this.password = password;
        this.created_at = new Date();
    }
}
