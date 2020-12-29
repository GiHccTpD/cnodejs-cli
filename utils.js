function rmUrlPrefixDoubleSlash(url) {
    return url.replace(/^\/\//, 'http://');
}

module.exports = {
    rmUrlPrefixDoubleSlash,
};
