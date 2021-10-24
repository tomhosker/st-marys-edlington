/*
This code defines a class which contains some functions which several other
classes may find useful.
*/

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
        } catch(err) {
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
        const result = MUtils.makeTwoFigureIntString(hours)+":"+
            MUtils.makeTwoFigureIntString(minutes);

        return result;
    }

    // Make two character representation of an integer.
    static makeTwoFigureIntString(integerInput) {
        let result = integerInput.toString();

        if(result.length === 2) return result;
        else if(result.length === 1) result = "0"+result;
        else return null;

        return result;
    }

    // Make the string stating WHEN a given service is to take place.
    static makeWhenString(weekday, day, month, year, hours, minutes) {
        const fourFigureTime = MUtils.makeFourFigureTime(hours, minutes);
        let dateObj, weekdayString, monthDay, monthString, yearString;
        let result;

        if(weekday === constants.NULL_WEEKDAY) {
            dateObj = new Date(year, month, day);
            weekdayString = constants.WEEKDAYS[dateObj.getDay()];
            monthDay = MUtils.makeTwoFigureIntString(dateObj.getDate());
            monthString = constants.SHORTH_MONTH_NAMES[dateObj.getMonth()];
            yearString = (dateObj.getFullYear()).toString();
            result =
                weekdayString+" "+monthDay+" "+monthString+" "+yearString+
                " at "+fourFigureTime;
        } else {
            weekdayString = constants.WEEKDAYS[weekday];
            result = "Every "+weekdayString+" at "+fourFigureTime;
        }

        return result;
    }

    // Return null if the input is falsy.
    static nullify(argument) {
        if(!argument) return null;

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
}

// Exports.
module.exports = MUtils;
