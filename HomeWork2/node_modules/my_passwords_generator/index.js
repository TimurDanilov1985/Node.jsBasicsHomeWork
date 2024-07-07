
function generateRandomPassword(min = 7, max = 21) {
    let resultString = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_!#$%&@1234567890';
    let stringLength = Math.floor(Math.random() * (max - min + 1)) + min;

    for (let i = 0; i < stringLength; i++) {
        resultString += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return resultString;
}

module.exports = {generateRandomPassword}; 