const fetch = require('node-fetch');
const config = require('./config');

const request = (method, params, v = config.vk.v) => new Promise((resolve, reject) => {
    const updatedParams = { access_token: config.app.accessToken, lang: 'ru', v, ...params };
    const preparedParams = Object.keys(updatedParams).reduce((a, x) => {
        a += `${x}=${updatedParams[x]}&`;
        return a;
    }, '');

    fetch(config.vk.apiDomain + method + '?' + preparedParams)
        .then((response) => response.json())
        .then((response) => {
            if (!response.response) {
                console.log({
                    type: 'error',
                    method,
                    params,
                    response: JSON.stringify(response),
                });
                return reject(response);
            }
            return resolve(response.response);
        })
        .catch(() => reject(null));
});

module.exports = request;