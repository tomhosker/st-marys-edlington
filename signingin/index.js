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

// Return a hash of the input string.
function getHash(inputString) {
    let hash = crypto.createHash(HASH_ALGORITHM);
    let result;

    hash.update(inputString);
    result = hash.digest(HASH_OUTPUT);

    return result;
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
exports.getHash = getHash;
exports.strategyFunc = strategyFunc;
exports.users = users;
