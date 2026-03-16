/*
This file defines some utility functions.
*/

const { raw } = require("body-parser");

/*************
 * FUNCTIONS *
 ************/

// Determine whether this app is running locally or in the cloud.
function runningLocally() {
    if (process.env.RUNNING_LOCALLY) {
        return true;
    }

    return false;
}

function processRawData(rawData) {
    const result = {columns: [], rows: []};
    let row;

    if (rawData.length === 0) return result;

    result.columns = Object.keys(rawData[0]);

    for (let rawRow of rawData) {
        row = [];

        for (let column of result.columns) {
            row.push(rawRow[column]);
        }

        result.rows.push(row);
    }

    return result;
}

function makeSummaries(data, keyField) {
    let result = [];
    let summary;

    for (let row of data) {
        summary = {
            id: row[keyField],
            description: JSON.stringify(row, null, 2)  // Pretty print JSON.
        };
        result.push(summary);
    }

    return result;
}

// Exports.
module.exports = {runningLocally, processRawData, makeSummaries};