/*
Returns any (sort of) static pages.
*/

// Imports.
const express = require("express");

// Local imports.
const Finaliser = require("../lib/finaliser.js");

// Constants.
const router = express.Router();
const finaliser = new Finaliser();

// GET home page.
router.get("/:id", function(req, res, next){
    const code = req.params.id;
    const title = getTitle(code);

    finaliser.protoRender(req, res, code, { title: title });
});

// A helper function.
function getTitle(code)
{
    const result;

    if(code === "delete") result = "How to Delete a Journal Entry";
    else if(code === "key") result = "Key";
    else result = code.charAt(0).toUpperCase()+code.slice(1);

    return result;
}

module.exports = router;
