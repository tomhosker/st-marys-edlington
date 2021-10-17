/*
This code defines a class which models the properties of the home page.
*/

// Constants.
const WEEKDAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

/****************
 ** MAIN CLASS **
 ***************/

class IndexMaker {
    constructor(data) {
        this.data = data;
        this.title = "Welcome";
        this.serviceTimes = makeServiceTimes(
            data.serviceTimes.columns,
            data.serviceTimes.rows
        );
        this.parishPriest = objectifyRow(
            data.parishPriest.columns,
            data.parishPriest.rows[0]
        );
        this.location = makeLocation(
            data.location.columns,
            data.location.rows[0]
        );
    }
}

/**********************
 ** HELPER FUNCTIONS **
 *********************/

// Ronseal.
function makeServiceTimes(columns, rows) {
    let result = [];
    let item;

    for (let i = 0; i < rows.length; i++) {
        item = {};

        for (let j = 0; j < columns.length; j++) {
            item[columns[j]] = rows[i][j];
        }

        item.weekdayString = WEEKDAYS[item.weekday];
        item.time = makeTimeFromHoursAndMinutes(item.hours, item.minutes);

        result.push(item);
    }

    return result;
}

// Ronseal.
function makeTimeFromHoursAndMinutes(hours, minutes) {
    let hoursString = hours.toString();
    let minutesString = minutes.toString();
    let result;

    if (hoursString.length === 1) hoursString = "0" + hoursString;
    if (minutesString.length === 1) minutesString = "0" + minutesString;

    result = hoursString + ":" + minutesString;

    return result;
}

// Ronseal.
function makeLocation(columns, row) {
    let result = objectifyRow(columns, row);

    if (result.house_number) {
        result.firstLine = result.house_number + " " + result.road_name;
    } else result.firstLine = result.road_name;

    return result;
}

// Ronseal.
function objectifyRow(columns, row) {
    let result = {};

    for (let i = 0; i < columns.length; i++) {
        result[columns[i]] = row[i];
    }

    return result;
}

// Exports.
module.exports = IndexMaker;
