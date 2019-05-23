
const NodeRSA = require("..");
const crypto = require("crypto");

{

    var seed = Buffer.from("hello world", "utf8");

    const data= crypto.randomBytes(10000);

    var previousExportedKeys = undefined;

    for (var i = 0; i < 10; i++) {

        const nodeRSA = NodeRSA.generateKeyPairFromSeed(
            seed,
            8 * 80
        );

        const [ privateKey, publicKey ]= [ "private", "public" ]
            .map(type => nodeRSA.exportKey(`pkcs1-${type}`));
        
        for (const key of [privateKey, publicKey]) {


            const [encryptMethod, decryptMethod] =
                key === privateKey ?
                    ["encryptPrivate", "decryptPublic"] :
                    ["encrypt", "decrypt"]
                ;

            const encryptionKey = key;

            const decryptionKey = [publicKey, privateKey]
                .find(key => key !== encryptionKey);

            const encryptionNodeRSA = new NodeRSA(encryptionKey);
            const decryptionNodeRSA = new NodeRSA(decryptionKey);

            const before= Date.now();

            if (!data.equals(decryptionNodeRSA[decryptMethod](encryptionNodeRSA[encryptMethod](data)))) {

                throw new Error("encode/decode problem");

            }

            console.log(`elapsed: ${key === privateKey ? "private": "public"} ${Date.now()-before}`);

        }

        const exportedKeys = `${publicKey}\n${privateKey}`;

        if (
            previousExportedKeys !== undefined &&
            previousExportedKeys !== exportedKeys
        ) {
            throw new Error("Not functional");
        }

        previousExportedKeys = exportedKeys;

        console.log("ok");

    }

    console.log("PASS");

}
