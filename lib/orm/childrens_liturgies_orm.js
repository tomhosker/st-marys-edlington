/*
This code defines an ORM for the Children's Liturgies page.
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

class ChildrensLiturgiesORM extends ORM {
    async gatherDataAsync() {
        try {
            return {
                childrensLiturgies: await this.runQueryAsync(
                    SELECT_CHILDRENS_LITURGIES,
                    []
                )
            };
        } finally {
            await this.retriever.close();
        }
    }
}

// Exports.
module.exports = ChildrensLiturgiesORM;
