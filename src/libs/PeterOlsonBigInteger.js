
var TomWuBigInteger = require("./TomWuBigInteger");
var peterOlson_BigIntegerStatic = require("big-integer");



/**
 * @param {number | Buffer } a
 * @param {number} a
 */
function BigInteger(a, b) {

    this.i = (function () {

        if (a != null) {
            if ("number" == typeof a) {
                return peterOlson_BigIntegerStatic((new TomWuBigInteger(a, b)).toString(10), 10);
            } else if (a instanceof Uint8Array) {
                return (function createBigIntegerFromUint8Array(uint8Array, isNegative) {

                    var out = peterOlson_BigIntegerStatic.fromArray(
                        Array.from(uint8Array),
                        2 ** 8,
                        isNegative
                    );

                    return out;

                })(a, false);
            } else if (b == null && "string" != typeof a) {
                throw new Error("here1");
            } else {
                return peterOlson_BigIntegerStatic(a, b);
            }
        } else {
            return peterOlson_BigIntegerStatic(0);
        }

    })();

}

function create(i){

    if( i instanceof Buffer) {
        throw new Error("fuck");
    }

    var out= new BigInteger(null);

    out.i= i;

    return out;

}



BigInteger.ONE = create(peterOlson_BigIntegerStatic.one);

//TODO: use t
/**
 * @param {number} t 
 * 
 * @returns {boolean}
 */
BigInteger.prototype.isProbablePrime = function (t) {

    return this.i.isProbablePrime();

};

/**
 * @param {BigInteger} bigInteger
 * 
 * @returns {BigInteger}
 */
BigInteger.prototype.subtract = function (bigInteger) {

    return create(
        this.i.subtract(bigInteger.i)
    );

};

/**
 * @param {BigInteger} bigInteger
 * 
 * @returns {BigInteger}
 */
BigInteger.prototype.gcd = function (bigInteger) {

    return create(
        peterOlson_BigIntegerStatic.gcd(
            this.i,
            bigInteger.i
        )
    );

};

/**
 * @param {BigInteger} bigInteger
 * 
 * @returns {number}
 */
BigInteger.prototype.compareTo = function (bigInteger) {

    return this.i.compareTo(bigInteger.i);

};

/**
 * @param {BigInteger} bigInteger
 * 
 * @returns {BigInteger}
 */
BigInteger.prototype.multiply = function (bigInteger) {

    return create(
        this.i.multiply(
            bigInteger.i
        )
    );

};

/**
 * @param {BigInteger} bigInteger
 * 
 * @returns {BigInteger}
 */
BigInteger.prototype.modInverse = function (bigInteger) {

    return create(
        this.i.modInv(bigInteger.i)
    );

};

BigInteger.prototype.toString = function (radix) {

    return this.i.toString(radix);

};

BigInteger.prototype.bitLength = function () {

    return this.i.bitLength().valueOf();

};

BigInteger.prototype.mod = function (bigInteger) {

    return create(
        this.i.mod(bigInteger.i)
    );

};

//TODO
BigInteger.prototype.toBuffer = function (trimOrSize) {

    return new TomWuBigInteger(this.i.toString(10), 10).toBuffer(trimOrSize);

};


/**
 * @param {BigInteger} exp
 * @param {BigInteger} mod
 * 
 * @returns {BigInteger}
 */
BigInteger.prototype.modPow = function (exp, mod) {

    return create(
        this.i.modPow(
            exp.i,
            mod.i
        )
    );

};

/**
 * @param {number} exp
 * @param {BigInteger} mod
 * 
 * @returns {BigInteger}
 */
BigInteger.prototype.modPowInt = function (exp, mod) {

    return new BigInteger(
        (new TomWuBigInteger(this.toBuffer())).modPowInt(
            exp,
            new TomWuBigInteger(mod.toBuffer())
        ).toBuffer()
    );

};

module.exports = BigInteger;

