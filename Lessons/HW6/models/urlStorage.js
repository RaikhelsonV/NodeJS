const storage = new Map();

function add(code, paylod, user) {
    const created_time = new Date();
    const visits = 0;
    const urlData = { ...paylod, created_time, visits, user };
    storage.set(code, urlData);

    for (const [key, value] of storage.entries()) {
        console.log(
            `Key: ${JSON.stringify(key)}, Value: ${JSON.stringify(value)}`
        );
    }
}

function addVisit(code) {
    const urlData = storage.get(code);
    if (urlData) {
        urlData.visits += 1;
        storage.set(code, urlData);
    }
}

function get(code) {
    return storage.get(code);
}

export default { add, get, addVisit };
