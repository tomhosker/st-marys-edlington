/*
This code defines a base class on which other Object-Relational Model classes
can be built.
*/

// Imports.
const PG = require("pg");

// Local imports.
const Finaliser = require("./finaliser.js");

// Local constant objects.
const Client = PG.Client;

/****************
 ** MAIN CLASS **
 ***************/

class SuperORM {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.client = this.getClient();
        this.data = {};
        this.finaliser = new Finaliser();
    }

    getClient() {
        let result;

        if (process.env.DATABASE_URL) {
            result = 
                new Client({
                    connectionString: process.env.DATABASE_URL,
                    ssl: { require: true, rejectUnauthorized: false },
                });
        } else result = null;

        return result;
    }

    runQuery(queryString, params, nextMethod, nextArgs, mockData) {
        let that = this;
        let extract;

        if (!mockData) mockData = [];

        if (this.client) {
console.log(queryString);
            this.client.connect();
            this.client.query(queryString, params, (err, result) => {
                if (err) throw err;

                extract = result.rows;
                that.client.end();

                nextArgs.push(extract);
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
