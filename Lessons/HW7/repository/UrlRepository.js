const storage = new Map();

export default class UrlRepository {
    add(url) {
        storage.set(url.code, url);
    }

    addVisit(code) {
        const urlData = storage.get(code);
        if (urlData) {
            urlData.visits += 1;
            storage.set(code, urlData);
        }
    }

    get(code) {
        return storage.get(code);
    }

    getUrlByUser(user) {
        try {
            const userUrls = [];
            for (const [_, urlData] of storage) {
                if (urlData.user.userId === user.userId) {
                    userUrls.push(urlData);
                }
            }
            return userUrls;
        } catch (error) {
            throw new Error('Failed to get URLs for user');
        }

    }

    getByUserId(userId) {
        return this.urls.filter((urlData) => urlData.user.userId === userId);
    }
}
