import urlStorage from '../models/urlStorage.js';
import randomCode from '../randomCode.js';

const length = 5;

function addUrl(payload, user) {
    const code = randomCode.generateHash(length);
    urlStorage.add(code, payload, user);
    return code;
}

function getUrlInfo(code) {
    const urlData = urlStorage.get(code);
    urlStorage.addVisit(code);
    return urlData;
}

function addVisit(code) {
    urlStorage.addVisit(code);
}

export { addUrl, getUrlInfo, addVisit };
