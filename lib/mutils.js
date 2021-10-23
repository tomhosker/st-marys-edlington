/*
This code defines a class which contains some functions which several other
classes may find useful.
*/

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class MUtils {
    constructor() {}

    // Determine, from the request object, whether the user is logged in as
    // admin.
    static isAdmin(reqObj) {
        try {
            if (reqObj.user.username) {
                if (reqObj.user.username === "admin") return true;
            }
        } catch(err) {
            if (err instanceof TypeError) {
                return false;
            } else {
                throw err;
            }
        }

        return false;
    }

    // Return null if the input is falsy.
    static nullify(argument) {
        if(!argument) return null;

        return argument;
    }

    // Ronseal.
    static objectifyRow(columns, row) {
        let result = {};

        for (let i = 0; i < columns.length; i++) {
            result[columns[i]] = row[i];
        }

        return result;
    }

    // Return the "exclusive or" result for the arguments.
    static xor(left, right) {
        const result = !!(left ^ right);

        return result;
    }
}

// Exports.
module.exports = MUtils;
