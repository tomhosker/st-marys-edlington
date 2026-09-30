/*
This code defines a class which amends the database.
*/

// Imports.
const Database = require("better-sqlite3");
const { Client } = require("pg");

// Local imports.
const constants = require("./constants.js");
const { liteToPG } = require("./retriever.js");
const { runningLocally } = require("./utils.js");

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
        if (process.env.LOG_DATABASE_QUERIES === "true") {
            console.log(`Running WRITE query: ${query}`);
            console.log(`with ${params.length} parameter(s)`);
        }
    }

    // Run a write query.
    async write(query, params) {
        this.preFetch(query, params);

        throw new Error("Writer.write must be implemented by a subclass.");
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
        this.preFetch(query, params);
        this.db.prepare(query).run(...params);

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
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: { require: true, rejectUnauthorized: false }
        });
        const convertedQuery = liteToPG(query);
        this.preFetch(convertedQuery, params);

        try {
            await client.connect();
            await client.query(convertedQuery, params);
            return true;
        } finally {
            await client.end().catch(() => {});
        }
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
module.exports = { getWriter };
