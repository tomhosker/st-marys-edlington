/*
This code handles the way in which user profiles are generated and retrieved.
*/

// Local imports.
const SuperORM = require("../super_orm.js");

// Local constants.
const HP = "84983c60f7daadc1cb8698621f802c0d9f9a3c3c295c810748fb048115c186ec";
const MOCK_LOGIN_DETAILS = [{ id: 1, username: "admin", hashed_password: HP }];

/********************
 ** MAIN FUNCTIONS **
 *******************/

// Return a record.
function findById(id, callBack) {
    let orm = new PassportORM(callBack);

    orm.findById(id);
}

// Return a record.
function findByUsername(username, callBack) {
    let orm = new PassportORM(callBack);

    orm.findByUsername(username);
}

/******************
 ** HELPER CLASS **
 *****************/

class PassportORM extends SuperORM {
    constructor(callBackRef) {
        super();
        this.callBackRef = callBackRef;
    }

    runCallBackFunc(extract) {
        const callBackFunc = this.callBackRef;
        let record;

        if (extract.length >= 1) {
            record = {
                id: extract[0].id,
                username: extract[0].username,
                hashedPassword: extract[0].hashed_password,
            };
            callBackFunc(null, record);
        } else {
            callBackFunc(new Error("User " + username + " does not exist."));
        }
    }

    findById(id) {
        const queryString = "SELECT * FROM UserLoginDetails WHERE id = $1;";

        this.runQuery(
            queryString,
            [id],
            "runCallBackFunc",
            [],
            MOCK_LOGIN_DETAILS
        );
    }

    findByUsername(username) {
        const queryString =
            "SELECT * FROM UserLoginDetails WHERE username = $1;";

        this.runQuery(
            queryString,
            [username],
            "runCallBackFunc",
            [],
            MOCK_LOGIN_DETAILS
        );
    }
}

// Exports.
exports.findById = findById;
exports.findByUsername = findByUsername;
