/*
This code holds a class which uploads some given data to the database.
*/

// Imports.
const PG = require("pg");

// Local imports.
const Constants = require("./constants.js");
const Finaliser = require("./finaliser.js");
const MUtils = require("./mutils.js");

// Constant objects.
const constants = new Constants();
const Client = PG.Client;

// Local constants.
const EXPECTED_TIME_STRING_FORMAT = "ho:mi";
const EXPECTED_HOURS_START = EXPECTED_TIME_STRING_FORMAT.indexOf("h");
const EXPECTED_HOURS_STOP = EXPECTED_HOURS_START + 2;
const EXPECTED_MINS_START = EXPECTED_TIME_STRING_FORMAT.indexOf("m");
const EXPECTED_MINS_STOP = EXPECTED_MINS_START + 2;

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class Uploader {
    constructor() {
        this.finaliser = new Finaliser();
    }

    insertNewServiceTime(req, res) {
        const tableName = "ServiceTime";
        const rawParams = [
            parseInt(req.body.weekday),
            getHoursFrom24HourTime(req.body.time),
            getMinutesFrom24HourTime(req.body.time),
            req.body.location,
            req.body.type,
            getDayFromHTMLDate(req.body.date),
            getMonthFromHTMLDate(req.body.date),
            getYearFromHTMLDate(req.body.date),
            !!req.body.has_childrens_liturgy,
            req.body.childrens_liturgy_remarks,
            req.body.remarks,
        ];
        const query =
            "INSERT INTO " +
            tableName +
            " (weekday, hours, minutes, " +
            "location, service_type, day, month, year, " +
            "has_childrens_liturgy, childrens_liturgy_remarks, remarks) " +
            "VALUES " +
            makeQueryAddition(1, rawParams.length) +
            ";";
        const params = extractParams(rawParams);
        // Check EITHER the weekday or date is unspecified, but not BOTH.
        const checkDateConfig = MUtils.xor(
            parseInt(req.body.weekday) === constants.NULL_WEEKDAY,
            req.body.date === ""
        );
        let properties;

        if (checkDateConfig) {
            this.runQuery(req, res, query, params, tableName);
        } else {
            properties = {
                title: "Upload Unsuccessful",
                success: false,
                error:
                    "You must specify EITHER a weekday or a date, but " +
                    "NOT BOTH and NOT NEITHER",
            };
            this.finaliser.protoRender(req, res, "aftersql", properties);
        }
    }

    deleteServiceTime(req, res) {
        const tableName = "ServiceTime";
        const query = "DELETE FROM " + tableName + " WHERE id = $1;";
        const params = [req.body.serviceTimeID];

        this.runQuery(req, res, query, params, tableName);
    }

    insertNewNewsletter(req, res) {
        const tableName = "Newsletter";
        const rawParams = [
            getDayFromHTMLDate(req.body.weekBeginning),
            getMonthFromHTMLDate(req.body.weekBeginning),
            getYearFromHTMLDate(req.body.weekBeginning),
            req.body.link,
        ];
        const query =
            "INSERT INTO " +
            tableName +
            " (week_beginning_day, " +
            "week_beginning_month, week_beginning_year, link) " +
            "VALUES " +
            makeQueryAddition(1, rawParams.length) +
            ";";
        const params = extractParams(rawParams);

        this.runQuery(req, res, query, params, tableName);
    }

    deleteNewsletter(req, res) {
        const tableName = "Newsletter";
        const query = "DELETE FROM " + tableName + " WHERE id = $1;";
        const params = [parseInt(req.body.newsletterID)];

        this.runQuery(req, res, query, params, tableName);
    }

    insertNewOtherDocument(req, res) {
        const tableName = "OtherDocument";
        const params = [req.body.name, req.body.link];
        const query =
            "INSERT INTO " +
            tableName +
            " (name, link) " +
            "VALUES " +
            makeQueryAddition(1, params.length) +
            ";";

        this.runQuery(req, res, query, params, tableName);
    }

    deleteOtherDocument(req, res) {
        const tableName = "OtherDocument";
        const query = "DELETE FROM " + tableName + " WHERE id = $1;";
        const params = [parseInt(req.body.documentID)];

        this.runQuery(req, res, query, params, tableName);
    }

    runQuery(req, res, queryString, params, tableName) {
        let that = this;
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
                    isDeletion: getWhetherDeletion(queryString),
                    error: null,
                };
            }
            client.end();
            that.finaliser.protoRender(req, res, "aftersql", properties);
        });
    }

    runQueries(req, res, queries, tableName, index, errors) {
        let that = this;
        let properties;
        const queryString = queries[index].queryString;
        const params = queries[index].params;
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: { require: true, rejectUnauthorized: false },
        });

        client.connect();
        client.query(queryString, params, (err, result) => {
            if (err) errors.push(err);

            if (index === queries.length - 1) {
                if (errors.length > 0) {
                    properties = {
                        title: "Uploads Unsuccessful",
                        success: false,
                        error: errors,
                    };
                } else {
                    properties = {
                        title: "Uploads Successful",
                        success: true,
                        data: req.body,
                        table: tableName,
                        isDeletion: getWhetherDeletion(queryString),
                        error: null,
                    };
                }
                client.end();
                that.finaliser.protoRender(req, res, "aftersql", properties);
            } else {
                that.runQueries(
                    req,
                    res,
                    queries,
                    tableName,
                    index + 1,
                    errors
                );
            }
        });
    }
}

/**********************
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

// Ronseal.
function getHoursFrom24HourTime(timeString) {
    const stringRep = timeString.slice(
        EXPECTED_HOURS_START,
        EXPECTED_HOURS_STOP
    );
    const result = parseInt(stringRep);

    return result;
}

// Ronseal.
function getMinutesFrom24HourTime(timeString) {
    const stringRep = timeString.slice(EXPECTED_MINS_START, EXPECTED_MINS_STOP);
    const result = parseInt(stringRep);

    return result;
}

// Ronseal.
function getDayFromHTMLDate(dateString) {
    let dateObj, result;

    if (!dateString) return null;

    dateObj = new Date(dateString);
    result = dateObj.getDate();

    return result;
}

// Ronseal.
function getMonthFromHTMLDate(dateString) {
    let dateObj, result;

    if (!dateString) return null;

    dateObj = new Date(dateString);
    result = dateObj.getMonth();

    return result;
}

// Ronseal.
function getYearFromHTMLDate(dateString) {
    let dateObj, result;

    if (!dateString) return null;

    dateObj = new Date(dateString);
    result = dateObj.getFullYear();

    return result;
}

// Get whether the query describes a deletion.
function getWhetherDeletion(queryString) {
    if (queryString.startsWith("DELETE FROM")) return true;

    return false;
}

// Exports.
module.exports = Uploader;
