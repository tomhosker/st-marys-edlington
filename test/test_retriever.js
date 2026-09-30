const expect = require("expect");

const { liteToPG } = require("../lib/retriever.js");

describe("Retriever helpers", function () {
    it("converts SQLite placeholders to PostgreSQL ordinals", function () {
        expect(liteToPG("SELECT * FROM Parish WHERE id = ? AND code = ?")).toBe(
            "SELECT * FROM Parish WHERE id = $1 AND code = $2"
        );
    });

    it("leaves queries without placeholders unchanged", function () {
        const query = "SELECT * FROM Newsletter";
        expect(liteToPG(query)).toBe(query);
    });
});
