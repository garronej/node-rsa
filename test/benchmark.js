
var NodeRSA = require("../src/NodeRSA");
var randomBytes = require("../src/crypto").randomBytes;
var detectEnvironment = require("../src/utils").detectEnvironment;
var BigInteger = require("../src/libs/jsbn");

var log = (function () {

    var acc = "";

    var f = function (str) {
        acc += str + "\n";
        console.log(str);
    }

    f.alert = function () {

        alert(acc);

    }

    return f;

})();

var seed = Buffer.from("hello world", "utf8");

var data = randomBytes(1000);

var previousExportedKeys = undefined;

[undefined, "Peter Olson", "Tom Wu"].forEach(function (author) {

    console.log("BigNumber impl: " + author);

    BigInteger.setModPowImpl(author);


    ["browser", "node"].forEach(function (environment) {

        if (environment === "node" && detectEnvironment() === "browser") {
            return;
        }

        log(environment);

        var start = Date.now();

        var nodeRSA = NodeRSA.generateKeyPairFromSeed(
            seed,
            8 * 80,
            undefined,
            environment
        );

        log("Keys generation: " + (Date.now() - start) + "ms");

        var privateKey;
        var publicKey;

        {

            var arr = ["private", "public"]
                .map(function (type) { return nodeRSA.exportKey("pkcs1-" + type); });

            privateKey = arr[0];
            publicKey = arr[1];

        }


        [privateKey, publicKey].forEach(function (key) {

            var encryptMethod;
            var decryptMethod;

            {

                var arr =
                    key === privateKey ?
                        ["encryptPrivate", "decryptPublic"] :
                        ["encrypt", "decrypt"]
                    ;

                encryptMethod = arr[0];
                decryptMethod = arr[1];

            }

            var encryptionKey = key;

            var decryptionKey = [publicKey, privateKey]
                .find(function (key) { return key !== encryptionKey; });

            var encryptionNodeRSA = new NodeRSA(encryptionKey, { "environment": environment });

            var decryptionNodeRSA = new NodeRSA(decryptionKey, { "environment": environment });

            var before = Date.now();

            var encryptedData = encryptionNodeRSA[encryptMethod](data);

            log("encryption with " + (encryptionKey === privateKey ? "private" : "public") + " key of " + data.length + " Bytes took " + (Date.now() - before) + "ms");

            before = Date.now();

            var dataBack = decryptionNodeRSA[decryptMethod](encryptedData);

            log("decryption with " + (decryptionKey === privateKey ? "private" : "public") + " key of " + data.length + " Bytes took " + (Date.now() - before) + "ms");


            if (!data.equals(dataBack)) {

                console.log({
                    "data    ": data.toString("hex"),
                    "dataBack": dataBack.toString("hex")
                });

                throw new Error("encode/decode problem");

            }


        });

        var exportedKeys = publicKey + "\n" + privateKey;

        if (
            previousExportedKeys !== undefined &&
            previousExportedKeys !== exportedKeys
        ) {
            throw new Error("Not functional");
        }

        if (previousExportedKeys === undefined) {
            previousExportedKeys = exportedKeys;
        }


    });


});


log("PASS!");

if (detectEnvironment() === "browser") {

    log.alert();

}

