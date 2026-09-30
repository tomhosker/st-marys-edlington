/*
This code handles the way in which user profiles are generated and retrieved.
*/

// Local imports.
const { attachPool } = require("../retriever.js");

// Local constants.
const HP = "84983c60f7daadc1cb8698621f802c0d9f9a3c3c295c810748fb048115c186ec";
const MOCK_LOGIN_DETAILS = [{ id: 1, username: "admin", hashed_password: HP }];

/******************
 * MAIN FUNCTIONS *
 *****************/

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

/****************
 * HELPER CLASS *
 ***************/

class PassportORM {
    constructor(callBackRef) {
        this.callBackRef = callBackRef;

        attachPool(this);
    }

    async runQuery(queryString, params, mockData = []) {
        try {
            let extract;

            if (this.pool) {
                const result = await this.pool.query(queryString, params);
                extract = result.rows;
            } else if (process.env.NODE_ENV !== "production") {
                extract = mockData;
            } else {
                throw new Error("DATABASE_URL must be set in production.");
            }

            this.runCallBackFunc(extract);
        } catch (error) {
            this.callBackRef(error);
        } finally {
            if (this.pool) await this.pool.end().catch(() => {});
        }
    }

    runCallBackFunc(extract) {
        const callBackFunc = this.callBackRef;
        let record;

        if (extract.length >= 1) {
            record = {
                id: extract[0].id,
                username: extract[0].username,
                hashedPassword: extract[0].hashed_password
            };
            callBackFunc(null, record);
        } else callBackFunc(null, null);
    }

    findById(id) {
        const queryString = "SELECT * FROM UserLoginDetails WHERE id = $1;";

        void this.runQuery(queryString, [id], MOCK_LOGIN_DETAILS);
    }

    findByUsername(username) {
        const queryString =
            "SELECT * FROM UserLoginDetails WHERE username = $1;";

        void this.runQuery(
            queryString,
            [username],
            MOCK_LOGIN_DETAILS.filter((record) => record.username === username)
        );
    }
}

// Exports.
exports.findById = findById;
exports.findByUsername = findByUsername;
