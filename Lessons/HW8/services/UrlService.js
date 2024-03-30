import UrlRepository from '../repository/UrlRepository.js';
import UrlModel from '../models/urlModel.js';
import { generateHash } from '../utils/randomCode.js';

export default class UrlService {
    constructor() {
        this.urlRepository = new UrlRepository();
    }

    addUrl(payload, user) {
        const length = 5;
        const code = generateHash(length);
        const { name, url } = payload;
        const urlData = new UrlModel(code, name, url, user);
        this.urlRepository.add(urlData);
        return code;
    }

    getUrlInfo(code) {
        const urlData = this.urlRepository.get(code);
        this.urlRepository.addVisit(code);
        return urlData;
    }
    getUrlsByUser(user) {
        return this.urlRepository.getUrlByUser(user)
    }

    addVisit(code) {
        this.urlRepository.addVisit(code);
    }
}
