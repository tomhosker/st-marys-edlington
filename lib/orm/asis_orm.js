/*
This code defines an ORM for gathering data from a given table "as is".
*/

// Local imports.
const ORM = require("./orm.js");
const { processRawData } = require("../utils.js");
const VALID_IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*$/;

/**************
 * MAIN CLASS *
 *************/

class AsisORM extends ORM {
    constructor(tableName, retriever) {
        super(retriever);

        if (!VALID_IDENTIFIER.test(tableName)) {
            this.retriever.close();
            throw new TypeError("Invalid table name.");
        }

        this.tableName = tableName;
    }

    async gatherDataAsync() {
        const query = `SELECT * FROM ${this.tableName};`;
        let raw, result;

        try {
            raw = await this.runQueryAsync(query, []);

            if (raw.length === 0) return null;

            result = processRawData(raw);
            return result;
        } finally {
            await this.retriever.close();
        }
    }
}

// Exports.
module.exports = AsisORM;
