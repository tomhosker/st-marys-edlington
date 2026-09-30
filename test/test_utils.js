const expect = require("expect");

const {
    makeSummaries,
    processRawData,
    runningLocally
} = require("../lib/utils.js");

describe("Utilities", function () {
    describe("runningLocally", function () {
        const originalValue = process.env.RUNNING_LOCALLY;

        afterEach(function () {
            if (originalValue === undefined) delete process.env.RUNNING_LOCALLY;
            else process.env.RUNNING_LOCALLY = originalValue;
        });

        it("only treats the explicit string true as local", function () {
            process.env.RUNNING_LOCALLY = "true";
            expect(runningLocally()).toBe(true);

            process.env.RUNNING_LOCALLY = "false";
            expect(runningLocally()).toBe(false);
        });
    });

    describe("processRawData", function () {
        it("returns empty columns and rows for an empty result", function () {
            expect(processRawData([])).toEqual({ columns: [], rows: [] });
        });

        it("turns database records into tabular data", function () {
            expect(
                processRawData([
                    { id: 1, name: "St Mary's" },
                    { id: 2, name: "Sacred Heart" }
                ])
            ).toEqual({
                columns: ["id", "name"],
                rows: [
                    [1, "St Mary's"],
                    [2, "Sacred Heart"]
                ]
            });
        });
    });

    it("builds readable record summaries", function () {
        expect(makeSummaries([{ code: "main", active: true }], "code")).toEqual(
            [
                {
                    id: "main",
                    description: '{\n  "code": "main",\n  "active": true\n}'
                }
            ]
        );
    });
});
