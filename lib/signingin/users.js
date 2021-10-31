/*
This code handles the way in which user profiles are generated and retrieved.
*/

// Imports.
const PG = require("pg");

// Local constant objects.
const Client = PG.Client;

/***************
 ** FUNCTIONS **
 **************/

// Return a record.
function findById (id, callBack) {
    const queryString = "SELECT * FROM UserLoginDetails WHERE id = $1;";
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

// Return a record.
function findByUsername (username, callBack) {
    const queryString = "SELECT * FROM UserLoginDetails WHERE username = $1;";
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

// Exports.
exports.findById = findById;
exports.findByUsername = findByUsername;
