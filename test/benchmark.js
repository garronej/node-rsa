
var NodeRSA = require("../src/NodeRSA");
var randomBytes = require("../src/crypto").randomBytes;
var detectEnvironment = require("../src/utils").detectEnvironment;

var log= (function(){

    var acc= "";

    var f= function(str){
        acc+= str;
        console.log(str);
    }

    f.alert= function(){

        alert(acc);

    }

    return f;

})();

var seed = Buffer.from("hello world", "utf8");

var data = randomBytes(500);

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

    log("Keys generation: " + (Date.now() - start) + "ms" );

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

        log("encryption with " +  (encryptionKey === privateKey ? "private" : "public") + " key of " + data.length + " Bytes took " + (Date.now() - before) + "ms");

        before = Date.now();

        var dataBack = decryptionNodeRSA[decryptMethod](encryptedData);

        log("encryption with " +  (decryptionKey === privateKey ? "private" : "public") + " key of " + data.length + " Bytes took " + (Date.now() - before) + "ms");
        

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
        throw new Error("Not functional");
    }

    previousExportedKeys = exportedKeys;


});

log("PASS!");

if( detectEnvironment() === "browser" ){

    log.alert();

}

