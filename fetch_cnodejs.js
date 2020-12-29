const axios = require('axios');
const _ = require('lodash');
const ora = require('ora');

const baseURL = 'https://cnodejs.org/api/v1';
// 创建axios实例
const service = axios.create({
    baseURL,
    timeout: 5000, // 请求超时时间
});

async function fetch(url, params = {}) {
    const spinner = ora('Loading').start();
    let result;
    try {
        result = await service.get(url, {
            params,
        });
        result = _.get(result, 'data');
    } catch (err) {
        return { success: false, data: [] };
    }

    spinner.stop();
    return result;
}

module.exports = fetch;
