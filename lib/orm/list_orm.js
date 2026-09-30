/*
This code defines an ORM for gathering a list of all the items in a given table.
*/

// Local imports.
const ORM = require("./orm.js");
const VALID_IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*$/;

/**************
 * MAIN CLASS *
 *************/

class ListORM extends ORM {
    constructor(
        tableName,
        keyField,
        linkBodyField,
        orderByField,
        linkStub,
        retriever
    ) {
        super(retriever);

        for (const identifier of [
            tableName,
            keyField,
            linkBodyField,
            orderByField
        ]) {
            if (!VALID_IDENTIFIER.test(identifier)) {
                this.retriever.close();
                throw new TypeError("Invalid database identifier.");
            }
        }
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

        try {
            raw = await this.runQueryAsync(query, []);
            result = this.processRawData(raw);
            return result;
        } finally {
            await this.retriever.close();
        }
    }
}

// Exports.
module.exports = ListORM;
