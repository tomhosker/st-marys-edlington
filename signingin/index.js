/*
This code allows the site to verify usernames and passwords.
*/

// Standard imports.
const crypto = require("crypto");

// Local imports.
const users = require("./users");

// Local constants.
const HASH_ALGORITHM = "sha256";
const HASH_OUTPUT = "hex";

/***************
 ** FUNCTIONS **
 **************/

// A function required by the passport package.
function deserializer(id, cb) {
    users.findById(id, function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    });
}

// Return a hash of the input string.
function getHash(inputString) {
    let hash = crypto.createHash(HASH_ALGORITHM);
    let result;

    hash.update(inputString);
    result = hash.digest(HASH_OUTPUT);

    return result;
}

// A function required by the passport package.
function serializer(user, callBack) {
    callBack(null, user.id);
}

// Return an authentication strategy.
function strategyFunc(username, password, cb) {
    users.findByUsername(username, function (err, user) {
        if (err) {
            return cb(err);
        }
        if (!user) {
            return cb(null, false);
        }
        if (user.hashedPassword != getHash(password)) {
            return cb(null, false);
        }
        return cb(null, user);
    });
}

// Exports.
exports.deserializer = deserializer;
exports.getHash = getHash;
exports.serializer = serializer;
exports.strategyFunc = strategyFunc;
exports.users = users;
