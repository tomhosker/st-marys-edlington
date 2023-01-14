/* This code defines a class which holds the project's global constants. */

// The class in question.
class Constants {
    constructor() {
        this.NULL_WEEKDAY = -1;
        this.WEEKDAYS = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        this.SHORTH_MONTH_NAMES = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
    }
}

// Exports.
module.exports = Constants;
