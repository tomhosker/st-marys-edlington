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
console.log("HERRO!")
console.log(reqObj.user);
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

    // Ronseal.
    static objectifyRow(columns, row) {
        let result = {};

        for (let i = 0; i < columns.length; i++) {
            result[columns[i]] = row[i];
        }

        return result;
    }
}

// Exports.
module.exports = MUtils;
