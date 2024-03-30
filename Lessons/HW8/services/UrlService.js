import UrlRepository from '../repository/UrlRepository.js';
import UrlModel from '../models/urlModel.js';
import {generateHash} from '../utils/randomCode.js';

export default class UrlService {
    constructor() {
        this.urlRepository = new UrlRepository();
    }

    async addUrl(payload, user) {
        const length = 5;
        const code = generateHash(length);
        const {name, url} = payload;
        const urlData = new UrlModel(code, name, url, user);
        console.log("service = url data" + JSON.stringify(urlData))
        await this.urlRepository.add(urlData);
        return code;
    }

    async getUrlInfo(code) {
        const urlData = await this.urlRepository.get(code);
        await this.urlRepository.addVisit(code);
        return urlData;
    }

    async addVisit(code) {
        await this.urlRepository.addVisit(code);
    }

    async getUrlsByUser(user) {
        console.log('service user' + JSON.stringify(user))
        const urls = await this.urlRepository.getUrlByUser(user);
        const result = [];
        for (const url of urls) {
            console.log(JSON.stringify(url), url.code, url.name)
            result.push({
                name: url.name,
                url: url.url,
            });
        }
        return result;
    }

    async getAllUrls() {
        const urls = await this.urlRepository.getAll();
        const result = [];
        for (const url of urls) {
            console.log(JSON.stringify(url), url.code, url.name)
            result.push({
                name: url.name,
                url: url.url,
            });
        }
        for (const [index, url] of result.entries()) {
            console.log(`Index: ${index}, Value: ${JSON.stringify(url)}`);
        }
        return result;
    }
}
