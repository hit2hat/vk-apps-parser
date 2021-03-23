const dotenv = require('dotenv');
const env = dotenv.config().parsed;

const config = {
    app: {
        accessToken: env.APP_ACCESS_TOKEN,
    },
    vk: {
        v: '5.130',
        apiDomain: 'https://api.vk.com/method/',
    },
};

module.exports = config;