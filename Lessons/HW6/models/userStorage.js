const storage = new Map();

function add(userData) {
    const created_time = new Date();
    const user = { ...userData, created_time };
    storage.set(userData.name, user);

    for (const [key, value] of storage.entries()) {
        console.log(
            `Key: ${JSON.stringify(key)}, Value: ${JSON.stringify(value)}`
        );
    }
}

function get(name) {
    return storage.get(name);
}

export { add, get };
