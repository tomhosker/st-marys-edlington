/*
This code holds a class which uploads some given data to the database.
*/

// Imports.
const PG = require("pg");

// Local imports.
const Constants = require("./constants.js");
const Finaliser = require("./finaliser.js");

// Local constants.
const constants = new Constants();
const Client = PG.Client;

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class Uploader {
    constructor() {
        this.finaliser = new Finaliser();
    }

    insertNewServiceTime(req, res, tableName) {
        const rawParams = [
            req.body.weekday,
            req.body.hours,
            req.body.minutes,
            req.body.location,
            req.body.service_type,
            req.body.day,
            req.body.month,
            req.body.year
        ];
console.log(req.body);
        const query =
            "INSERT INTO "+tableName+" (weekday, hours, minutes, "+
                "location, service_type, day, month, year) " +
            "VALUES "+makeQueryAddition(1, rawParams.length)+";";
        let params = [];
        let properties;

        params = extractParams(rawParams);

        if((req.body.weekday === "") || req.body.day === "") {
            this.runQuery(req, res, query, params, tableName);
        } else {
            properties = {
                title: "Upload Unsuccessful",
                success: false,
                error: "You can specify EITHER a weekday, or a date, "+
                       "but not both"
            };
            this.finaliser.protoRender(req, res, "aftersql", properties);
        }
    }


    runQuery(req, res, queryString, params, tableName) {
        let that = this;
        let errorFlag = false;
        let properties;
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: { require: true, rejectUnauthorized: false },
        });

        client.connect();
        client.query(queryString, params, (err, result) => {
            if (err) {
                properties = {
                    title: "Upload Unsuccessful",
                    success: false,
                    error: err,
                };
            } else {
                properties = {
                    title: "Upload Successful",
                    success: true,
                    data: req.body,
                    table: tableName,
                    error: null,
                };
            }
            client.end();
            that.finaliser.protoRender(req, res, "aftersql", properties);
        });
    }
}

/*********************
 ** HELPER FUNCTIONS **
 *********************/

// Ronseal.
function extractParams(data) {
    let result = Object.values(data);

    for (let i = 0; i < result.length; i++) {
        if (result[i] === "") result[i] = null;
    }

    return result;
}

// Add the "blanks" to a PostgreSQL query where the parameters will go.
function makeQueryAddition(startingOrdinal, insertWidth) {
    let result = "(";

    for (let i = startingOrdinal; i < startingOrdinal + insertWidth; i++) {
        if (i !== startingOrdinal) result = result + ", ";

        result = result + "$" + i;
    }
    result = result + ")";

    return result;
}

// Exports.
module.exports = Uploader;
