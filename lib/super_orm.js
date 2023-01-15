/*
This code defines a base class on which other Object-Relational Model classes
can be built.
*/

// Local imports.
const Finaliser = require("./finaliser.js");
const MUtils = require("./mutils.js");

/****************
 ** MAIN CLASS **
 ***************/

class SuperORM {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.data = {};
        this.finaliser = new Finaliser();
    }

    runQuery(queryString, params, nextMethod, nextArgs, mockData) {
        let that = this;
        let extract;

        console.log("Running query: " + queryString);

        if (!mockData) mockData = [];

        if (!this.res) this.res = {};

        MUtils.attachPool(this.res);

        if (this.res.pool) {
            this.res.pool.query(queryString, params, function (err, result) {
                if (err) throw err;

                extract = result.rows;

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
