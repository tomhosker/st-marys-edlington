/*
This code defines a class which models the properties of the home page.
*/

// Constants.
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
                  "Friday", "Saturday"];

/****************
 ** MAIN CLASS **
 ***************/

class IndexMaker
{
    constructor(data)
    {
        this.data = data;
        this.title = "Welcome";
        this.serviceTimes = makeServiceTimes(data.serviceTimes.columns,
                                             data.serviceTimes.rows);
    }
}

/**********************
 ** HELPER FUNCTIONS **
 *********************/

// Ronseal.
function makeServiceTimes(columns, rows)
{
    let result = [];
    let item;

    for(let i = 0; i < rows.length; i++)
    {
        item = {};

        for(let j = 0; j < columns.length; j++)
        {
            item[columns[j]] = rows[i][j];
        }

        item.weekdayString = WEEKDAYS[item.weekday];
        item.time = makeTimeFromHoursAndMinutes(item.hours, item.minutes);

        result.push(item);
    }

console.log(result);

    return result;
}

// Ronseal.
function makeTimeFromHoursAndMinutes(hours, minutes)
{
    let hoursString = hours.toString();
    let minutesString = minutes.toString();
    let result;

    if(hoursString.length === 1) hoursString = "0"+hoursString;
    if(minutesString.length === 1) minutesString = "0"+minutesString;

    result = hoursString+":"+minutesString;

    return result;
}

// Exports.
module.exports = IndexMaker;
