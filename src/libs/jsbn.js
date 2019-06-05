

const PeterOlsonBigInteger = require("./PeterOlsonBigInteger");
const TomWuBigInteger = require("./TomWuBigInteger");
const MixedBigInteger= require("./MixedBigInteger");


var map= new Map();

var Impl;

/**
 * @param {number | Buffer } a
 * @param {number} a
 */
function BigInteger(a, b) {

    const name = arguments.callee.name;

    let history= map.get(name);

    if( !history ){
        history= {
            "times": 0,
            "duration": 0
        };

        map.set(name, history);

    }

    const start= Date.now();

    this.i = new Impl(a,b);

    history.times++;
    history.duration+= Date.now()-start;


}

BigInteger.map = map;



function create(i){

    var out= new BigInteger(null);

    out.i= i;

    return out;

}



/** 
 * @param {Peter Olson|Tom Wu}  implAuthor
 * */
BigInteger.setImpl = function (implAuthor) {

    Impl = (function () {

        switch (implAuthor) {
            case "Peter Olson":
                return PeterOlsonBigInteger;
            case "Tom Wu":
                return TomWuBigInteger;
            case "Mixed":
                return MixedBigInteger;
        }

    })();



    BigInteger.ONE = new BigInteger("1",10);

};


BigInteger.setImpl("Peter Olson");



//TODO: use t
/**
 * @param {number} t 
 * 
 * @returns {boolean}
 */
BigInteger.prototype.isProbablePrime = function isProbablePrime(t) {


    const name = arguments.callee.name;

    let history = map.get(name);

    if (!history) {
        history = {
            "times": 0,
            "duration": 0
        };

        map.set(name, history);

    }

    const start = Date.now();

    let out = this.i.isProbablePrime(t)

    history.times++;
    history.duration += Date.now() - start;

    return out;

};

/**
 * @param {BigInteger} bigInteger
 * 
 * @returns {BigInteger}
 */
BigInteger.prototype.subtract = function subtract(bigInteger) {


    const name = arguments.callee.name;

    let history = map.get(name);

    if (!history) {
        history = {
            "times": 0,
            "duration": 0
        };

        map.set(name, history);

    }

    const start = Date.now();

    let out = create(this.i.subtract(bigInteger.i));

    history.times++;
    history.duration += Date.now() - start;

    return out;

};

/**
 * @param {BigInteger} bigInteger
 * 
 * @returns {BigInteger}
 */
BigInteger.prototype.gcd = function gcd(bigInteger) {


    const name = arguments.callee.name;

    let history = map.get(name);

    if (!history) {
        history = {
            "times": 0,
            "duration": 0
        };

        map.set(name, history);

    }

    const start = Date.now();

    let out = create(this.i.gcd(bigInteger.i));

    history.times++;
    history.duration += Date.now() - start;

    return out;

};

/**
 * @param {BigInteger} bigInteger
 * 
 * @returns {number}
 */
BigInteger.prototype.compareTo = function compareTo(bigInteger) {


    const name = arguments.callee.name;

    let history = map.get(name);

    if (!history) {
        history = {
            "times": 0,
            "duration": 0
        };

        map.set(name, history);

    }

    const start = Date.now();

    let out = this.i.compareTo(bigInteger.i);

    history.times++;
    history.duration += Date.now() - start;

    return out;

};

/**
 * @param {BigInteger} bigInteger
 * 
 * @returns {BigInteger}
 */
BigInteger.prototype.multiply = function multiply(bigInteger) {


    const name = arguments.callee.name;

    let history = map.get(name);

    if (!history) {
        history = {
            "times": 0,
            "duration": 0
        };

        map.set(name, history);

    }

    const start = Date.now();

    let out = create(this.i.multiply(bigInteger.i));

    history.times++;
    history.duration += Date.now() - start;

    return out;


};

/**
 * @param {BigInteger} bigInteger
 * 
 * @returns {BigInteger}
 */
BigInteger.prototype.modInverse = function modInverse(bigInteger) {


    const name = arguments.callee.name;

    let history = map.get(name);

    if (!history) {
        history = {
            "times": 0,
            "duration": 0
        };

        map.set(name, history);

    }

    const start = Date.now();

    let out = create(this.i.modInverse(bigInteger.i));

    history.times++;
    history.duration += Date.now() - start;

    return out;

};

BigInteger.prototype.toString = function toString(radix) {


    const name = arguments.callee.name;

    let history = map.get(name);

    if (!history) {
        history = {
            "times": 0,
            "duration": 0
        };

        map.set(name, history);

    }

    const start = Date.now();

    let out = this.i.toString(radix);

    history.times++;
    history.duration += Date.now() - start;

    return out;

};

BigInteger.prototype.bitLength = function bitLength() {


    const name = arguments.callee.name;

    let history = map.get(name);

    if (!history) {
        history = {
            "times": 0,
            "duration": 0
        };

        map.set(name, history);

    }

    const start = Date.now();

    let out = this.i.bitLength();

    history.times++;
    history.duration += Date.now() - start;

    return out;

};

BigInteger.prototype.mod = function mod(bigInteger) {


    const name = arguments.callee.name;

    let history = map.get(name);

    if (!history) {
        history = {
            "times": 0,
            "duration": 0
        };

        map.set(name, history);

    }

    const start = Date.now();

    let out = create(this.i.mod(bigInteger.i));

    history.times++;
    history.duration += Date.now() - start;

    return out;

};

BigInteger.prototype.toBuffer = function toBuffer(trimOrSize) {


    const name = arguments.callee.name;

    let history = map.get(name);

    if (!history) {
        history = {
            "times": 0,
            "duration": 0
        };

        map.set(name, history);

    }

    const start = Date.now();

    let out = this.i.toBuffer(trimOrSize);

    history.times++;
    history.duration += Date.now() - start;

    return out;

};


/**
 * @param {BigInteger} exp
 * @param {BigInteger} mod
 * 
 * @returns {BigInteger}
 */
BigInteger.prototype.modPow = function modPow(exp, mod) {


    const name = arguments.callee.name;

    let history = map.get(name);

    if (!history) {
        history = {
            "times": 0,
            "duration": 0
        };

        map.set(name, history);

    }

    const start = Date.now();

    let out = create(this.i.modPow(exp.i, mod.i));

    history.times++;
    history.duration += Date.now() - start;

    return out;

};

/**
 * @param {number} exp
 * @param {BigInteger} mod
 * 
 * @returns {BigInteger}
 */
BigInteger.prototype.modPowInt = function modPowInt(exp, mod) {


    const name = arguments.callee.name;

    let history = map.get(name);

    if (!history) {
        history = {
            "times": 0,
            "duration": 0
        };

        map.set(name, history);

    }

    const start = Date.now();

    let out = create(this.i.modPowInt(exp, mod.i));

    history.times++;
    history.duration += Date.now() - start;

    return out;

};

module.exports = BigInteger;



