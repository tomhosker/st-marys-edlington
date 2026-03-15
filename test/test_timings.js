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
        const expResult = (new Date()).toISOString();
        let timings = new Timings();

        expect(timings.getNow()).toEqual(expResult);
    });
});
