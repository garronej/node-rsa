
const NodeRSA = require("..");

{

    var seed = Buffer.from("hello world", "utf8");

    var previousExportedKey = undefined;

    for (var i = 0; i < 10; i++) {

        var key = NodeRSA.generateKeyPairFromSeed(
            seed,
            8 * 80
        );

        var exportedKey = key.exportKey("pkcs1");

        if (
            previousExportedKey !== undefined &&
            previousExportedKey !== exportedKey
        ) {
            throw new Error("Not functional");
        }

        previousExportedKey = exportedKey;

    }

    console.log(previousExportedKey);

}
