import crypto from 'crypto';

const allowedChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateHash(length) {
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, allowedChars.length);
        result += allowedChars[randomIndex];
    }

    return result;
}

export default { generateHash };
