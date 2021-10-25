/*
This code defines a class which models the properties of the home page.
*/

// Local imports.
const Constants = require("./constants.js");
const MUtils = require("./mutils.js");

// Constant objects.
const constants = new Constants();

/****************
 ** MAIN CLASS **
 ***************/

class IndexMaker {
    constructor(data, req) {
        this.data = data;
        this.title = "Welcome";
        this.serviceTimes = makeServiceTimes(
            data.serviceTimes.columns,
            data.serviceTimes.rows
        );
        this.parishPriest = MUtils.objectifyRow(
            data.parishPriest.columns,
            data.parishPriest.rows[0]
        );
        this.location = makeLocation(
            data.location.columns,
            data.location.rows[0]
        );
        this.mostRecentNewsletter =
            makeMostRecentNewsletter(data.newsletters);
        this.isAdmin = MUtils.isAdmin(req);
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

        item.time =
            MUtils.makeWhenString(
                item.weekday,
                item.day,
                item.month,
                item.year,
                item.hours,
                item.minutes
            );

        result.push(item);
    }

    return result;
}

// Ronseal.
function makeLocation(columns, row) {
    let result = MUtils.objectifyRow(columns, row);

    if (result.house_number) {
        result.firstLine = result.house_number + " " + result.road_name;
    } else result.firstLine = result.road_name;

    return result;
}

// Return an object giving the properties of the most newsletter, if possible.
function makeMostRecentNewsletter(data) {
    let result, mostRecentData, weekBeginning;

    if(!data || (data.rows.length === 0)) return null;

    mostRecentData = MUtils.objectifyRow(data.columns, data.rows[0]);
    weekBeginning =
        MUtils.makeMyDateFormat(
            mostRecentData.week_beginning_day,
            mostRecentData.week_beginning_month,
            mostRecentData.week_beginning_year
        );

    result = { weekBeginning: weekBeginning, link: mostRecentData.link };

    return result;
}

// Exports.
module.exports = IndexMaker;
