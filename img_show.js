const terminalImage = require('terminal-image');
const got = require('got');

(async () => {
    const body = await got('https://pic1.zhimg.com/v2-99bc0897dc40b8178ca738e0763e149e_720w.jpg\?source\=3af55fa1').buffer();
    console.log(await terminalImage.buffer(body, { width: '10%', height: '10%' }));
})();
