/*
Returns a table from the database, pretty much as is.
*/

// Imports.
const express = require("express");

// Local imports.
const { getRetriever } = require("../lib/retriever.js");
const AsisORM = require("../lib/orm/asis_orm.js");
const Finaliser = require("../lib/finaliser.js");

// Constants.
const router = express.Router();
const finaliser = new Finaliser();

// Return the page for a list of all tables.
router.get("/", async (req, res, next) => {
    const retriever = getRetriever();

    try {
        const tableNames = await retriever.fetchAllTableNames();
        await finaliser.protoRender(req, res, "asis_list", {
            title: "List of Tables",
            tableNames
        });
    } catch (error) {
        next(error);
    } finally {
        await retriever.close();
    }
});

// Return the page for a given table.
router.get("/:id", async (req, res, next) => {
    const tableName = req.params.id;

    try {
        const orm = new AsisORM(tableName);
        const data = await orm.gatherDataAsync();

        if (data === null) {
            res.status(404).send(`No table with name: ${tableName}`);
        } else {
            await finaliser.protoRender(req, res, "asis", {
                title: tableName,
                data
            });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
