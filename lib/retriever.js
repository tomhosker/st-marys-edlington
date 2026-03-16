/*
This code defines a class which retrieves the required data from the database.
*/

// Imports.
const {Client, Pool} = require("pg");
const Database = require("better-sqlite3");

// Local imports.
const constants = require("./constants.js");
const {runningLocally} = require("./utils.js");

/**************
 * MAIN CLASS *
 **************/

// An abstract class.
class Retriever {
    constructor() {
        // Nothing to see here!
    }

    // Write a log before running a fetch query.
    preFetch(query, params) {
        console.log(`Running READ query: ${query}`);
        console.log(`with params: ${params}`);
    }

    // Write a log after running a fetch query.
    postFetch(data) {
        console.log(`Fetched data: ${JSON.stringify(data)}`);
    }

    // Run a db.all() call asynchronously.
    async fetchAll(query, params) {
        this.preFetch(query, params);
        this.postFetch(null);

        return null;
    }

    // Fetch a list of names of all the tables in the database.
    async fetchAllTableNames() {
        return [];
    }

    // Shut down the connection.
    async close() {
        return null;
    }
}

// For reading data from a local SQLite database.
class RetrieverLocal extends Retriever {
    constructor() {
        super();

        this.db = new Database(constants.pathToLocalDB);

        this.db.pragma("journal_mode = WAL");
    }

    // Run a db.all() call asynchronously.
    async fetchAll(query, params) {
        const statement = this.db.prepare(query);
        let result;

        this.preFetch(query, params);

        try {
            result = statement.all(...params);
        } catch (error) {
            console.log(error);

            return false;
        }

        this.postFetch(result);

        return result;
    }

    // Fetch a list of names of all the tables in the database.
    async fetchAllTableNames() {
        const query = "SELECT name FROM sqlite_master WHERE type='table';"
        const raw = await this.fetchAll(query, []);
        let result = [];

        for (let record of raw) {
            result.push(record.name);
        }

        return result;
    }

    // Shut down the connection.
    async close() {
        this.db.close();
    }
}

// For reading data from a cloud-based database.
class RetrieverCloud extends Retriever {
    constructor() {
        super();
    }

    // Run a SELECT query asynchronously.
    async fetchAll(query, params) {
        const client =
            new Client({
                connectionString: process.env.DATABASE_URL,
                ssl: { require: true, rejectUnauthorized: false },
            });
        let raw, result;

        this.preFetch(query, params);

        await client.connect();

        query = liteToPG(query);
        raw = await client.query(query, params);
        result = raw.rows;

        this.postFetch(result);

        await client.end();

        return result;
    }

    // Fetch a list of names of all the tables in the database.
    async fetchAllTableNames() {
        const query = "SELECT tablename FROM pg_catalog.pg_tables;";
        const raw = await this.fetchAll(query, []);
        let result = [];

        for (let record of raw) {
            result.push(record.tablename);
        }

        return result;
    }

    // Shut down the connection.
    async close() {
        // Intentionally empty.
    }
}

/********************
 * HELPER FUNCTIONS *
 ********************/

// Return the correct retriever object for the current context.
function getRetriever() {
    if (runningLocally()) return new RetrieverLocal();

    return new RetrieverCloud();
}

/******************
 * POOL FUNCTIONS *
 *****************/

// Return a pool object.
function getPool() {
    let result = null;

    if (process.env.DATABASE_URL) {
        result =
            new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: { require: true, rejectUnauthorized: false },
            });
    }

    return result;
}

// Attach a pool object to another.
function attachPool(otherObj) {
    const poolObj = getPool();

    if (!otherObj) otherObj = {};

    if (poolObj && !otherObj.pool) otherObj.pool = poolObj;
}

// End the pool object which is attached to the input.
function killPool(otherObj) {
    if (otherObj.pool) otherObj.pool.end();

    delete otherObj.pool;
}

// Convert an SQLite-style query string into a Postgres-style one.
function liteToPG(query) {
    let ordinal = 1;

    while (query.includes("?")) {
        query = query.replace("?", "$"+ordinal);
        ordinal++;
    }

    return query;
}

// Exports.
module.exports = {getRetriever, getPool, attachPool, killPool, liteToPG};
