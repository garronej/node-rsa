

module.exports = {
    getEngine: function (keyPair, options) {
        var engine = require('./js.js');
        if (options.environment === 'node') {
            var crypt = require((function(){return "crypto"})());
            if (typeof crypt.publicEncrypt === 'function' && typeof crypt.privateDecrypt === 'function') {
                if (typeof crypt.privateEncrypt === 'function' && typeof crypt.publicDecrypt === 'function') {
                    engine = require((function () { return './io.js' })());
                } else {
                    engine = require((function () { return './node12.js'; })());
                }
            }
        }
        return engine(keyPair, options);
    }
};