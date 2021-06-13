const axios = require('axios');

const getWithRetry = async (url, config) => {
    try {
        console.log(`Request: ${url}`);
        let response = await axios.get(url, config);
        console.log('Got Reddit response:');
        console.log(response);
        return response;
    } catch (e) {
        if (e.errno && e.errno.toUpperCase() === 'ETIMEDOUT') {
            console.warn('Timed out, retrying...');
            return await getWithRetry(url, config);
        } else {
            console.error('Exception on Reddit:');
            console.log(e);
            throw e;
        }
    }
}

module.exports = getWithRetry;
