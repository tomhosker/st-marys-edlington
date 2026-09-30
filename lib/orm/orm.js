/*
This code defines the ORM abstract class.
*/

// Local imports.
const { getRetriever } = require("../retriever.js");

/**************
 * MAIN CLASS *
 *************/

// The class in question.
class ORM {
    constructor(retriever = getRetriever()) {
        this.retriever = retriever;
    }

    async runQueryAsync(query, params) {
        return this.retriever.fetchAll(query, params);
    }

    async gatherDataAsync() {
        // This is where the magic is supposed to happen.
        await this.retriever.close();
    }
}

// Exports.
module.exports = ORM;
