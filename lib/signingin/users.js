/*
This code handles the way in which user profiles are generated and retrieved.
*/

// Imports.
const PG = require("pg");

// Constants.
//const records = [{ id: 1, username: "admin", hashedPassword: "84983c60f7daadc1callBack8698621f802c0d9f9a3c3c295c810748fb048115c186ec" }];

// Local constant objects.
const Client = PG.Client;

/***************
 ** FUNCTIONS **
 **************/

// Return a record.
function findById (id, callBack) {
    const queryString = "SELECT * FROM UserLoginDetails WHERE id = ?;";
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { require: true, rejectUnauthorized: false },
    });
    let extract, record;

    client.connect();
    client.query(queryString, [id], (err, result) => {
        if (err) throw err;

        extract = result.rows;
        client.end();

        if(extract.length >= 1) {
            record = {
                id: extract[0].id,
                username: extract[0].username,
                hashedPassword: extract[0].hashed_password
            }
            callBack(null, record);
        } else {
            callBack(new Error("User " + id + " does not exist."));
        }
    });
}

/*
// Return a record.
function findById (id, callBack) {
    process.nextTick(function () {
        let idx = id - 1;

        if (records[idx]) {
            callBack(null, records[idx]);
        } else {
            callBack(new Error("User " + id + " does not exist."));
        }
    });
}
*/

// Return a record.
function findByUsername (username, callBack) {
    const queryString = "SELECT * FROM UserLoginDetails WHERE username = ?;";
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { require: true, rejectUnauthorized: false },
    });
    let extract, record;

    client.connect();
    client.query(queryString, [username], (err, result) => {
        if (err) throw err;

        extract = result.rows;
        client.end();

        if(extract.length >= 1) {
            record = {
                id: extract[0].id,
                username: extract[0].username,
                hashedPassword: extract[0].hashed_password
            }
            callBack(null, record);
        } else {
            callBack(new Error("User " + username + " does not exist."));
        }
    });
}

/*
// Return a record.
function findByUsername (username, callBack) {
    process.nextTick(function () {
        let record;

        for (let i = 0; i < records.length; i++) {
            record = records[i];

            if (record.username === username) {
                return callBack(null, record);
            }
        }

        return callBack(null, null);
    });
}
*/

// Exports.
exports.findById = findById;
exports.findByUsername = findByUsername;
