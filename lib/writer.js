/*
This code defines a class which amends the database.
*/

// Imports.
const Database = require("better-sqlite3");
const {Client} = require("pg");

// Local imports.
const constants = require("./constants.js");
const {liteToPG} = require("./retriever.js");
const {runningLocally} = require("./utils.js");

/**************
 * MAIN CLASS *
 **************/

// An abstract class.
class Writer {
    constructor() {
        // Something, something, dark side.
    }

    // Write a log before running a write query.
    preFetch(query, params) {
        console.log(`Running WRITE query: ${query}`);
        console.log(`with params: ${params}`);
    }

    // Run a write query.
    async write(query, params) {
        this.preFetch(query, params);

        return null;
    }

    // Shut down the connection.
    async close() {
        return null;
    }
}

// For writing data to a local SQLite database.
class WriterLocal extends Writer {
    constructor() {
        super();

        this.db = new Database(constants.pathToLocalDB);

        this.db.pragma("journal_mode = WAL");
    }

    // Run a "write" query.
    async write(query, params) {
        const statement = this.db.prepare(query);

        this.preFetch(query, params);

        try {
            statement.run(...params);
        } catch (error) {
            console.log(error);

            return false;
        }

        return true;
    }

    // Shut down the connection.
    async close() {
        this.db.close();
    }
}

// For writing data to a cloud-based database.
class WriterCloud extends Writer {
    constructor() {
        super();
    }

    // Run a "write" query.
    async write(query, params) {
        const client =
            new Client({
                connectionString: process.env.DATABASE_URL,
                ssl: { require: true, rejectUnauthorized: false },
            });
        let result;

        query = liteToPG(query);
        this.preFetch(query, params);

        await client.connect();

        console.log(`Running WRITE query: ${query}`);
        console.log(`with params: ${params}`);

        try {
            result = await client.query(query, params);
        } catch (error) {
            console.log(error);

            return false;
        }

        await client.end();

        return true;
    }

    // Shut down the connection.
    async close() {
        // Intentionally empty.
    }
}

/********************
 * HELPER FUNCTIONS *
 *******************/

// Return the correct writer object for the current context.
function getWriter() {
    if (runningLocally()) return new WriterLocal();

    return new WriterCloud();
}

// Exports.
module.exports = {getWriter};