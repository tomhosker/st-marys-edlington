/*
This code defines a base class on which other Object-Relational Model classes
can be built.
*/

// Imports.
const PG = require("pg");

// Local imports.
const Finaliser = require("./finaliser.js");

// Local constant objects.
const Pool = PG.Pool;

/****************
 ** MAIN CLASS **
 ***************/

class SuperORM {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.pool = this.getPool();
        this.data = {};
        this.finaliser = new Finaliser();
    }

    getPool() {
        let result = null;

        if (process.env.DATABASE_URL) {
            result = new PG.Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: { require: true, rejectUnauthorized: false },
            });
        }

        return result;
    }

    runQuery(queryString, params, nextMethod, nextArgs, mockData) {
        let that = this;
        let extract;

        console.log("Running query: " + queryString);

        if (!mockData) mockData = [];

        if (this.pool) {
            this.pool.query(queryString, params, function (err, result) {
                if (err) throw err;

                extract = result.rows;

                nextArgs.push(extract);
                that.pool.end();
                that[nextMethod](...nextArgs);
            });
        } else {
            nextArgs.push(mockData);
            this[nextMethod](...nextArgs);
        }
    }
}

// Exports.
module.exports = SuperORM;
