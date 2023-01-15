/*
This code defines a class which contains some functions which several other
classes may find useful.
*/

// Imports.
const PG = require("pg");

// Local imports.
const Constants = require("./constants.js");

// Constant objects.
const constants = new Constants();

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class MUtils {
    constructor() {}

    // Determine, from the request object, whether the user is logged in as
    // admin.
    static isAdmin(reqObj) {
        try {
            if (reqObj.user.username) {
                if (reqObj.user.username === "admin") return true;
            }
        } catch (err) {
            if (err instanceof TypeError) {
                return false;
            } else {
                throw err;
            }
        }

        return false;
    }

    // Ronseal.
    static makeFourFigureTime(hours, minutes) {
        const result =
            MUtils.makeTwoFigureIntString(hours) +
            ":" +
            MUtils.makeTwoFigureIntString(minutes);

        return result;
    }

    // Return a date in the form 01 Jan 2000. Months are 0-11.
    static makeMyDateFormat(dayNum, monthNum, year) {
        const dayString = MUtils.makeTwoFigureIntString(dayNum);
        const monthString = constants.SHORTH_MONTH_NAMES[monthNum];
        const yearString = year.toString();
        const result = dayString + " " + monthString + " " + yearString;

        return result;
    }

    // Return a date in the form 01 Jan. Months are 0-11.
    static makeDayMonthString(dayNum, monthNum) {
        const dayString = MUtils.makeTwoFigureIntString(dayNum);
        const monthString = constants.SHORTH_MONTH_NAMES[monthNum];
        const result = dayString + " " + monthString;

        return result;
    }

    // Make two character representation of an integer.
    static makeTwoFigureIntString(integerInput) {
        let result = integerInput.toString();

        if (result.length === 2) return result;
        else if (result.length === 1) result = "0" + result;
        else return null;

        return result;
    }

    // Make the string stating WHEN a given service is to take place.
    static makeWhenString(weekday, day, month, year, hours, minutes) {
        const fourFigureTime = MUtils.makeFourFigureTime(hours, minutes);
        let dateObj, weekdayString, dateString;
        let result;

        if (weekday === constants.NULL_WEEKDAY) {
            dateObj = new Date(year, month, day);
            weekdayString = constants.WEEKDAYS[dateObj.getDay()];
            dateString = MUtils.makeMyDateFormat(
                dateObj.getDate(),
                dateObj.getMonth(),
                dateObj.getFullYear()
            );
            result = weekdayString + " " + dateString + " at " + fourFigureTime;
        } else {
            weekdayString = constants.WEEKDAYS[weekday];
            result = "Every " + weekdayString + " at " + fourFigureTime;
        }

        return result;
    }

    // Return null if the input is falsy.
    static nullify(argument) {
        if (!argument) return null;

        return argument;
    }

    // Ronseal.
    static objectifyRow(columns, row) {
        let result = {};

        for (let i = 0; i < columns.length; i++) {
            result[columns[i]] = row[i];
        }

        return result;
    }

    // Return the "exclusive or" result for the arguments.
    static xor(left, right) {
        const result = !!(left ^ right);

        return result;
    }

    // Return a pool object.
    static getPool() {
        let result = null;

        if (process.env.DATABASE_URL) {
            result = new PG.Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: { require: true, rejectUnauthorized: false },
            });
        }

        return result;
    }

    // Attach a pool object to another.
    static attachPool(otherObj) {
        const poolObj = MUtils.getPool();

        if (!otherObj) otherObj = {};

        if (poolObj && !otherObj.pool) otherObj.pool = poolObj;
    }

    // End the pool object which is attached to the input.
    static killPool(otherObj) {
        if (otherObj.pool) otherObj.pool.end();

        delete otherObj.pool;
    }
}

// Exports.
module.exports = MUtils;
