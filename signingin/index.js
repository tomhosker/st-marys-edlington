/*
This code allows the site to verify usernames and passwords.
*/

// Standard imports.
const crypto = require("crypto");

// Local constants.
const HASH_ALGORITHM = "sha256";
const HASH_OUTPUT = "hex";

/**************
** FUNCTIONS **
**************/

// Return a hash of the input string.
function getHash(inputString) {
    let hash = createHash(HASH_ALGORITHM);
    let result;

    hash.update(inputString);
    result = hash.digest(HASH_OUTPUT);

    return result;
}

// Exports.
exports.users = require("./users");
exports.getHash = getHash;
