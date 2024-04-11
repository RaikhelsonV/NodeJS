export default class Url {
    code;
    name;
    url;
    user;

    constructor(code, name, url, user) {
        this.code = code;
        this.name = name;
        this.url = url;
        this.created_at = new Date();
        this.visits = 0;
        this.user = user;
    }
}
