/*
This code defines an ORM for the Youth page.
*/

// Local imports.
const ORM = require("./orm.js");

// Queries.
const SELECT_CHILDRENS_LITURGIES = `
    SELECT ServiceTime.*, RealWorldAddress.short_name AS location_name
    FROM ServiceTime
    JOIN RealWorldAddress ON RealWorldAddress.code = ServiceTime.location
    WHERE has_childrens_liturgy = true;
`;

/**************
 * MAIN CLASS *
 *************/

class YouthORM extends ORM {
    async gatherDataAsync() {
        const result = {
            childrensLiturgies:
                await this.runQueryAsync(SELECT_CHILDRENS_LITURGIES, [])
        };

        this.retriever.close();

        return result;
    }
}

// Exports.
module.exports = YouthORM;
