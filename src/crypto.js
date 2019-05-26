'use strict'

module.exports= require('create-hash');

{

    var nodeCrypto = undefined;

    [
        "createSign",
        "createVerify",
    ].forEach(function (fnName) {

        module.exports[fnName] = function () {

            if (nodeCrypto === undefined) {
                nodeCrypto = require((function () { return "crypto" })());
            }

            nodeCrypto[fnName].apply(nodeCrypto, arguments);

        };


    });

}

module.exports.randomBytes = (function () {

    // limit of Crypto.getRandomValues()
    // https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
    var MAX_BYTES = 65536

    // Node supports requesting up to this number of bytes
    // https://github.com/nodejs/node/blob/master/lib/internal/crypto/random.js#L48
    var MAX_UINT32 = 4294967295

    function getRandomValues(abv) {

        if (Math.random.isSeeded) {

            var l = abv.length;
            while (l--) {
                abv[l] = Math.floor(Math.random() * 256);
            }
            return abv;


        } else {

            var crypto = global.crypto || global.msCrypto

            if (crypto && crypto.getRandomValues) {
                return crypto.getRandomValues(abv);
            } else {
                throw new Error('Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11')
            }
        }

    }

    return function randomBytes(size) {

        // phantomjs needs to throw
        if (size > MAX_UINT32) throw new RangeError('requested too many random bytes')

        var bytes = Buffer.allocUnsafe(size)

        if (size > 0) {  // getRandomValues fails on IE if size == 0
            if (size > MAX_BYTES) { // this is the max bytes crypto.getRandomValues
                // can do at once see https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
                for (var generated = 0; generated < size; generated += MAX_BYTES) {
                    // buffer.slice automatically checks if the end is past the end of
                    // the buffer so we don't have to here
                    getRandomValues(bytes.slice(generated, generated + MAX_BYTES))
                }
            } else {
                getRandomValues(bytes)
            }
        }

        return bytes

    };


})();



