/*
This code defines a class which processes the data required for a form which
deletes the record for a given service time.
*/

// Local imports.
const MUtils = require("./mutils.js");
const Constants = require("./constants.js");

// Constant objects.
const constants = new Constants();

/****************
 ** MAIN CLASS **
 ***************/

class DeleteFromServiceTimeMaker {
    constructor(data, action) {
        this.data = data;
        this.formAction = action;
        this.title = "Remove a Service Time";
        this.serviceSummaries = makeServiceSummaries(
            data.serviceTimes.columns,
            data.serviceTimes.rows
        );
    }
}

/**********************
 ** HELPER FUNCTIONS **
 *********************/

// Transform the columns and rows into a list of objects.
function makeServiceSummaries(columns, rows) {
    let result = [];
    let description, objectifiedRow, serviceSummary;

    for (let i = 0; i < rows.length; i++) {
        objectifiedRow = MUtils.objectifyRow(columns, rows[i]);
        description = makeDescription(objectifiedRow);
        serviceSummary = { id: objectifiedRow.id, description: description };
        result.push(serviceSummary);
    }

    return result;
}

// Make a string describing a given service.
function makeDescription(dataObj) {
    const what = dataObj.service_type;
    const when = MUtils.makeWhenString(
        dataObj.weekday,
        dataObj.day,
        dataObj.month,
        dataObj.year,
        dataObj.hours,
        dataObj.minutes
    );
    const where = dataObj.location_name;
    const result = what + " | " + when + " | " + where;

    return result;
}

// Exports.
module.exports = DeleteFromServiceTimeMaker;
