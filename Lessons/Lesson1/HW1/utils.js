const crypto = require('crypto');

function generateHash(length){
    let result = '';
    const allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, allowedChars.length);
        result += allowedChars[randomIndex];
    }
    
    return result;
    
}


module.exports = {
    generateHash,
}