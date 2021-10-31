/*
Returns any (sort of) static pages.
*/

// Imports.
const express = require("express");

// Local imports.
const Finaliser = require("../lib/finaliser.js");

// Constants.
const CUSTOM_TITLES = {
    "externallinks": "External Links"
};

// Constant global objects.
const router = express.Router();
const finaliser = new Finaliser();

// GET home page.
router.get("/:id", function (req, res, next) {
    const code = req.params.id;
    const title = getTitle(code, CUSTOM_TITLES);

    finaliser.protoRender(req, res, code, { title: title });
});

// A helper function.
function getTitle(code, customTitles) {
    let result;

console.log(code);
console.log(customTitles);
console.log(code in Object.keys(customTitles));

    if (code in Object.keys(customTitles)) {
        result = customTitles[code];
    } else {
        result = code.charAt(0).toUpperCase() + code.slice(1);
    }

    return result;
}

module.exports = router;
