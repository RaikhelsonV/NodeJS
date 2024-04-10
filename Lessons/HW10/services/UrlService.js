import UrlRepository from '../repository/UrlRepository.js';
import UrlModel from '../models/urlModel.js';
import {generateHash} from '../utils/randomCode.js';
import appLogger from "appLogger";

const log = appLogger.getLogger('UrlService.js');

export default class UrlService {
    constructor() {
        this.urlRepository = new UrlRepository();
    }

    async addUrl(payload, user) {
        const length = 5;
        const code = generateHash(length);
        const {name, url} = payload;
        const urlData = new UrlModel(code, name, url, user);
        log.debug(JSON.stringify(urlData))
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
        log.debug(JSON.stringify(user))
        const urls = await this.urlRepository.getUrlByUser(user);
        const result = [];
        for (const url of urls) {
            log.debug(JSON.stringify(url), url.code, url.name)
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
            log.debug(JSON.stringify(url), url.code, url.name)
            result.push({
                name: url.name,
                url: url.url,
            });
        }
        return result;
    }
}
