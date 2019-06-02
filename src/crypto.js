'use strict'

var utils= require("./utils");
var standaloneCreateHash = require("create-hash");

var getNodeCrypto = (function () {

    var nodeCrypto = undefined;

    return function () {

        if (nodeCrypto === undefined) {
            nodeCrypto = require("crypto" + "");
        }

        return nodeCrypto;

    }

})();

module.exports = {};

module.exports.createHash = (function(){

    if( utils.detectEnvironment() === "node" ){

        try{ 

            var nodeCrypto= getNodeCrypto();

            return nodeCrypto.createHash.bind(nodeCrypto);

        }catch(error){ }

    }

    return standaloneCreateHash;

})();


[
    "createSign",
    "createVerify"
].forEach(function (fnName) {

    module.exports[fnName] = function () {

        var nodeCrypto = getNodeCrypto();

        nodeCrypto[fnName].apply(nodeCrypto, arguments);

    };

});

module.exports.randomBytes = (function () {
    
    var browserGetRandomValues= (function(){

        if( typeof crypto === "object" && !!crypto.getRandomValues ){
            return crypto.getRandomValues.bind(crypto);
        }else if( typeof msCrypto === "object" && !!msCrypto.getRandomValues ){
            return msCrypto.getRandomValues.bind(msCrypto);
        }else if( typeof self === "object" && typeof self.crypto === "object" && !!self.crypto.getRandomValues ){
            return self.crypto.getRandomValues.bind(self.crypto);
        }else{
            return undefined;
        }

    })();


    var getRandomValues = (function () {

        var nonCryptographicGetRandomValue = function (abv) {

            var l = abv.length;
            while (l--) {
                abv[l] = Math.floor(Math.random() * 256);
            }
            return abv;

        };

        return function (abv) {

            if (Math.random.isSeeded) {

                return nonCryptographicGetRandomValue(abv);

            } else {

                if (!!browserGetRandomValues) {

                    return browserGetRandomValues(abv);

                } else {

                    //NOTE: Unsafe. Edge in a a ServiceWorker execution context.
                    return nonCryptographicGetRandomValue(abv);

                }

            }

        };


    })();

    // limit of Crypto.getRandomValues()
    // https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
    var MAX_BYTES = 65536

    // Node supports requesting up to this number of bytes
    // https://github.com/nodejs/node/blob/master/lib/internal/crypto/random.js#L48
    var MAX_UINT32 = 4294967295

    return function randomBytes(size) {
        if (!Math.random.isSeeded && !browserGetRandomValues) {

            try {

                var nodeBufferInst= getNodeCrypto().randomBytes(size);

                return Buffer.from(
                    nodeBufferInst.buffer, 
                    nodeBufferInst.byteOffset, 
                    nodeBufferInst.length
                );

            } catch (error) { 
            }

        }

        // phantomjs needs to throw
        if (size > MAX_UINT32) throw new RangeError('requested too many random bytes')

        var bytes = Buffer.allocUnsafe(size);

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
