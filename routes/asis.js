/*
Returns a table from the database, pretty much as is.
*/

// Imports.
const express = require("express");

// Local imports.
const AsisORM = require("../lib/orm/asis_orm.js");
const Finaliser = require("../lib/finaliser.js");

// Constants.
const router = express.Router();
const finaliser = new Finaliser();

// Return the page for a given table.
router.get("/:id", (req, res) => {
    const tableName = req.params.id;
    const orm = new AsisORM(tableName);
    let properties;

    orm.gatherDataAsync().then((data) => {
        if (data === null) {
            res.send(`No table with name: ${tableName}`);
        } else {
            properties = {title: tableName, data: data};
            finaliser.protoRender(req, res, "asis", properties);
        }
    });
});

module.exports = router;
