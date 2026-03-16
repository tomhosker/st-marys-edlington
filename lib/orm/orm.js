/*
This code defines the ORM abstract class.
*/

// Local imports.
const {getRetriever} = require("../retriever.js");

/**************
 * MAIN CLASS *
 *************/

// The class in question.
class ORM {
    constructor() {
        this.retriever = getRetriever();
        this.data = null;
    }

    async runQueryAsync(query, params) {
        let result;

        try {
            result = await this.retriever.fetchAll(query, params);
        } catch (error) {
            console.log(`Hit error: ${error}`);
            console.log(`Running query: ${query}`);
            console.log(`With params: ${params}`);
            result = null;
        }

        return result;
    }

    async gatherDataAsync() {
        // This is where the magic is supposed to happen.
        this.retriever.close();
    }

    gatherData(nextFunc, nextArgs) {
        this.gatherDataAsync.then((data) => nextFunc(...nextArgs.push(data)));
    }
}

// Exports.
module.exports = ORM;