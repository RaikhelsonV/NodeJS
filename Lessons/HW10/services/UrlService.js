import {isPast} from 'date-fns';
import UrlRepository from '../repository/UrlRepository.js';
import UrlModel from '../models/urlModel.js';
import {generateHash} from '../utils/randomCode.js';
import appLogger from "appLogger";

const log = appLogger.getLogger('UrlService.js');
const CODE_LENGTH = 10;

export default class UrlService {
    constructor() {
        this.urlRepository = new UrlRepository();
    }

    async addUrl(payload, user) {
        let {name, url, code, type, expire_at} = payload;
        if (!code || code.length === 0) {
            code = generateHash(CODE_LENGTH);
        }
        const urlData = new UrlModel(code, name, url, expire_at, type, true, user);

        try {
            await this.urlRepository.add(urlData);
            return code;
        } catch (error) {
            log.error('Error adding URL:', error);
            throw {error: 'Failed to create URL. Please check your input and try again.'};
        }

    }

    async addVisit(code) {
        await this.urlRepository.addVisit(code);
    }

    async updateEnabledStatus(code, status) {
        await this.urlRepository.updateEnabledStatus(code, status);
    }

    async updateType(code, type) {
        await this.urlRepository.updateType(code, type);
    }

    async updateTypeAndExpireAt(code, type, expire_at) {
        await this.urlRepository.updateTypeAndExpireAt(code, type, expire_at);
    }

    async updateDate(code, expire_at) {
        await this.urlRepository.updateExpireAt(code, expire_at);
    }

    async updateExpiredUrls(urls) {
        const expiredUrls = urls.filter(url => {
            if (url.expire_at && isPast(new Date(url.expire_at))) {
                log.info(`URL with code ${url.code} has expired. Disabling...`);
                return true;
            }
            return false;
        });
        for (const url of expiredUrls) {
            await this.urlRepository.updateEnabledStatus(url.code, false);
        }
    }

    async deleteUrl(code) {
        try {
            const deletedUrl = await this.urlRepository.delete(code);
            log.debug("Deleted url:", deletedUrl);
            return deletedUrl;
        } catch (error) {
            log.error(`Error deleting url with code ${code}:`, error);
            throw new Error('Failed to delete url');
        }
    }

    async getUrlInfo(code) {
        const urlData = await this.urlRepository.get(code);
        return urlData;
    }

    async getUrlsByUser(user) {
        return this.formatUrls(await this.urlRepository.getUrlByUser(user));
    }

    async getTopFiveUrlsByUser(user_id) {
        return this.formatUrls(await this.urlRepository.getTopFiveVisitedUrlsByUserId(user_id));
    }

    async getTopFiveUrls() {
        return this.formatUrls(await this.urlRepository.getTopFiveVisitedUrls());
    }

    formatUrls(urls) {
        const result = [];
        for (const url of urls) {
            result.push({
                code: url.code,
                name: url.name,
                url: url.url,
                enabled: url.enabled,
                visits: url.visits,
                type: url.type,
                expire_at: url.expire_at
            });
        }
        return result;
    }


}
