
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

var data = randomBytes(10);

["Mixed", "Peter Olson", "Tom Wu"].forEach(function (author) {

    console.log("BigNumber impl: " + author);

    BigInteger.setImpl(author);

    var previousExportedKeys = undefined;

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

        var [privateKey, publicKey] = ["private", "public"]
            .map(type => nodeRSA.exportKey(`pkcs1-${type}`));

        for (const key of [privateKey, publicKey]) {


            var [encryptMethod, decryptMethod] =
                key === privateKey ?
                    ["encryptPrivate", "decryptPublic"] :
                    ["encrypt", "decrypt"]
                ;

            var encryptionKey = key;

            var decryptionKey = [publicKey, privateKey]
                .find(key => key !== encryptionKey);

            var encryptionNodeRSA = new NodeRSA(encryptionKey, { environment });

            var decryptionNodeRSA = new NodeRSA(decryptionKey, { environment });

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

        }

        const exportedKeys = `${publicKey}\n${privateKey}`;

        if (
            previousExportedKeys !== undefined &&
            previousExportedKeys !== exportedKeys
        ) {
            console.log({
                previousExportedKeys,
                exportedKeys
            })
            throw new Error("Not functional");
        }

        previousExportedKeys = exportedKeys;

        percentage(BigInteger.map);

        console.log(Array.from(BigInteger.map));

        BigInteger.map.clear();

    });


});


function percentage(map) {

    const tot = Array.from(map.values()).map(({ duration }) => duration)
        .reduce((prev, cur) => prev + cur, 0);

    for (const value of map.values()) {

        value.per = ((value.duration / tot) * 100).toFixed(2) + "%";

    }

}

log("PASS!");

if (detectEnvironment() === "browser") {

    log.alert();

}

