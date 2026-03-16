/*
This code defines an ORM for the home page.
*/

// Local imports.
const ORM = require("./orm.js");

// Queries.
const SELECT_SERVICE_TIMES = `
    SELECT id, weekday, hours, minutes, service_type, day, month, year, remarks,
        RealWorldAddress.short_name AS location_name
    FROM ServiceTime
    JOIN RealWorldAddress ON RealWorldAddress.code = ServiceTime.location
    ORDER BY weekday, year, month, day, hours, minutes;
`;
const SELECT_PARISH_PRIEST = `
    SELECT Contact.*, RealWorldAddress.short_name AS address_name
    FROM ParishRole
    JOIN Contact ON Contact.code = ParishRole.contact
    JOIN RealWorldAddress ON RealWorldAddress.code = Contact.address
    WHERE ParishRole.code = 'parish-priest';
`;
const SELECT_LOCATIONS = `
    SELECT *
    FROM RealWorldAddress
    WHERE code = 'st-marys-edlington'
    OR code = 'sacred-heart-balby'
    OR code = 'st-mary-magdalene-maltby'
    ORDER BY is_main DESC, short_name;
`;
const SELECT_NEWSLETTERS = `
    SELECT *
    FROM Newsletter
    ORDER BY week_beginning_year DESC, week_beginning_month DESC,
        week_beginning_day DESC, link;
`;

/**************
 * MAIN CLASS *
 *************/

class IndexORM extends ORM {
    async fetchParishPriest() {
        const raw = await this.runQueryAsync(SELECT_PARISH_PRIEST, []);
        const result = raw[0];

        return result;
    }

    async gatherDataAsync() {
        const result = {
            serviceTimes: await this.runQueryAsync(SELECT_SERVICE_TIMES, []),
            parishPriest: await this.fetchParishPriest(),
            locations: await this.runQueryAsync(SELECT_LOCATIONS, []),
            newsletters: await this.runQueryAsync(SELECT_NEWSLETTERS, [])
        };

        this.retriever.close();

        return result;
    }
}

// Exports.
module.exports = IndexORM;
