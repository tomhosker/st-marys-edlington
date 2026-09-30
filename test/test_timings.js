/*
Test the Timings class.
*/

// Standard imports.
const expect = require("expect");

// Local imports.
const Timings = require("../lib/timings.js");

/*************
 ** TESTING **
 ************/

describe("Test Timings", function () {
    it("Test getNow", function () {
        const now = new Date("2026-09-30T12:34:56.789Z");
        const timings = new Timings(now);

        expect(timings.getNow()).toEqual(now.toISOString());
    });

    it("formats Gregorian dates consistently", function () {
        const timings = new Timings(new Date(2026, 8, 3, 12));

        expect(timings.getMyGreg()).toBe("03 Sep 2026");
    });
});
