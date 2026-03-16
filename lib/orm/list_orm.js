/*
This code defines an ORM for gathering a list of all the items in a given table.
*/

// Local imports.
const ORM = require("./orm.js");

/**************
 * MAIN CLASS *
 *************/

class ListORM extends ORM {
    constructor(tableName, keyField, linkBodyField, orderByField, linkStub) {
        super();
        this.tableName = tableName;
        this.keyField = keyField;
        this.linkBodyField = linkBodyField;
        this.orderByField = orderByField;
        this.linkStub = linkStub;
    }

    processRawData(raw) {
        const result = [];
        let link;

        for (let rawItem of raw) {
            link = {
                url: `/${this.linkStub}/${rawItem[this.keyField]}`,
                body: rawItem[this.linkBodyField]
            };

            result.push(link);
        }

        return result;
    }

    async gatherDataAsync() {
        const query =
            `SELECT * FROM ${this.tableName} ` +
            `ORDER BY ${this.orderByField};`;
        let raw, result;

        raw = await this.runQueryAsync(query, []);

        if (raw === null) return null;

        result = this.processRawData(raw);
        this.retriever.close();

        return result;
    }
}

// Exports.
module.exports = ListORM;