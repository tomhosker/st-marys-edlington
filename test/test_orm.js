const expect = require("expect");

const AsisORM = require("../lib/orm/asis_orm.js");
const IndexORM = require("../lib/orm/index_orm.js");
const ListORM = require("../lib/orm/list_orm.js");

function makeRetriever(results = []) {
    return {
        calls: [],
        closed: false,
        async fetchAll(query, params) {
            this.calls.push({ query, params });
            return results.shift() || [];
        },
        async close() {
            this.closed = true;
        }
    };
}

describe("ORMs", function () {
    it("rejects unsafe table names before issuing a query", function () {
        const retriever = makeRetriever();

        expect(
            () => new AsisORM("Newsletter; DROP TABLE Newsletter", retriever)
        ).toThrow("Invalid table name.");
        expect(retriever.calls).toHaveLength(0);
        expect(retriever.closed).toBe(true);
    });

    it("converts a table result and closes the connection", async function () {
        const retriever = makeRetriever([[{ id: 1, name: "Newsletter" }]]);
        const orm = new AsisORM("Newsletter", retriever);

        await expect(orm.gatherDataAsync()).resolves.toEqual({
            columns: ["id", "name"],
            rows: [[1, "Newsletter"]]
        });
        expect(retriever.closed).toBe(true);
    });

    it("builds list links from configured fields", function () {
        const orm = new ListORM(
            "Newsletter",
            "id",
            "name",
            "name",
            "newsletters",
            makeRetriever()
        );

        expect(orm.processRawData([{ id: 7, name: "September" }])).toEqual([
            { url: "/newsletters/7", body: "September" }
        ]);
    });

    it("closes the home-page retriever when a query fails", async function () {
        const retriever = makeRetriever();
        retriever.fetchAll = async () => {
            throw new Error("query failed");
        };
        const orm = new IndexORM(retriever);

        await expect(orm.gatherDataAsync()).rejects.toThrow("query failed");
        expect(retriever.closed).toBe(true);
    });
});
