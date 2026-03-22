/*
This code defines an ORM for the Pilgrimages page.
*/

// Local imports.
const ORM = require("./orm.js");

// Queries.
const SELECT_PILGRIMAGES = `
    SELECT *
    FROM Pilgrimage
    WHERE end_year > ?
    OR (end_year = ? AND end_month > ?)
    OR (end_year = ? AND end_month = ? AND end_day >= ?)
    ORDER BY end_year, end_month, end_day
`;

/**************
 * MAIN CLASS *
 *************/

class PilgrimagesORM extends ORM {
    async gatherPilgrimages() {
        const today = new Date();
        const y = today.getFullYear();
        const m = today.getMonth() + 1;
        const d = today.getDate();
        const subs = [y, y, m, y, m, d];
        const result = this.runQueryAsync(SELECT_PILGRIMAGES, subs);

        return result;
    }

    async gatherDataAsync() {
        const result = {
            pilgrimages: await this.gatherPilgrimages()
        };

        this.retriever.close();

        return result;
    }
}

// Exports.
module.exports = PilgrimagesORM;
