/*
This code holds a class which scrapes the required data from a database.
*/

// Imports.
const PG = require("pg");

// Local imports.
const Finaliser = require("./finaliser.js");
const IndexMaker = require("./index_maker.js");

// Local constants.
const Client = PG.Client;
const MILLISECONDS_IN_A_SECOND = 1000;

/****************
 ** MAIN CLASS **
 ***************/

class Scraper {
    constructor() {
        this.finaliser = new Finaliser();
    }

    // Fetch a table more or less as it is from the database.
    fetchAsIs(req, res) {
        const tableName = req.params.id;

        this.checkTableName(req, res, tableName);
    }

    // Fetches a list of table names, and checks the table name in question
    // against it.
    checkTableName(req, res, tableName) {
        const queryString =
            "SELECT table_schema, table_name " +
            "FROM information_schema.tables " +
            "WHERE table_type = 'BASE TABLE';";
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: { require: true, rejectUnauthorized: false },
        });
        let that = this;
        let extract;
        let tableNames = [];

        client.connect();
        client.query(queryString, (err, result) => {
            if (err) throw err;

            extract = result.rows;
            client.end();

            if (checkTableName(tableName, extract) === false) {
                res.send("Bad table name: " + tableName);
            } else that.fetchAsIsPart2(req, res, tableName);
        });
    }

    // Fetches a table from the database as is.
    fetchAsIsPart2(req, res, tableName) {
        const queryString = "SELECT * FROM " + tableName + ";";
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: { require: true, rejectUnauthorized: false },
        });
        let that = this;
        let extract, data;

        client.connect();
        client.query(queryString, (err, result) => {
            if (err) throw err;

            extract = result.rows;
            client.end();

            data = objectifyExtract(extract);

            that.finaliser.protoRender(req, res, "asis", {
                title: tableName,
                data: data,
            });
        });
    }

    // Ronseal.
    scrapeIndex(req, res) {
        let scraper = new IndexScraper(req, res);

        scraper.startHere();
    }

    // Ronseal.
    scrapeUpload2ServiceTime(req, res, properties) {
        let scraper = new Upload2ServiceTimeScraper(req, res, properties);

        scraper.startHere();
    }
}

/********************
 ** HELPER CLASSES **
 *******************/

// A parent class.
class SuperScraper {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: { require: true, rejectUnauthorized: false },
        });
        this.data = {};
        this.finaliser = new Finaliser();
    }
}

// Gather the neccessary data for the site's home page.
class IndexScraper extends SuperScraper {
    constructor(req, res) {
        super(req, res);
    }

    startHere() {
        this.client.connect();
        this.fetchServiceTimes();
    }

    fetchServiceTimes() {
        const queryString =
            "SELECT weekday, hours, minutes, service_type, day, month, " +
            "year, remarks, RealWorldAddress.short_name AS location_name " +
            "FROM ServiceTime " +
            "JOIN RealWorldAddress ON RealWorldAddress.code = " +
            "ServiceTime.location " +
            "ORDER BY weekday ASC, hours ASC, minutes ASC;";
        let that = this;
        let extract;

        this.client.query(queryString, (err, result) => {
            if (err) throw err;

            extract = result.rows;
            that.data.serviceTimes = objectifyExtract(extract);

            that.fetchParishPriest();
        });
    }

    fetchParishPriest() {
        const queryString =
            "SELECT Contact.*, RealWorldAddress.short_name AS " +
            "address_name " +
            "FROM ParishRole " +
            "JOIN Contact ON Contact.code = ParishRole.contact " +
            "JOIN RealWorldAddress ON RealWorldAddress.code = " +
            "Contact.address " +
            "WHERE ParishRole.code = 'parish-priest';";
        let that = this;
        let extract;

        this.client.query(queryString, (err, result) => {
            if (err) throw err;

            extract = result.rows;
            that.data.parishPriest = objectifyExtract(extract);

            that.fetchLocation();
        });
    }

    fetchLocation() {
        const queryString =
            "SELECT * " +
            "FROM RealWorldAddress " +
            "WHERE code = 'st-marys-edlington';";
        let that = this;
        let extract;

        this.client.query(queryString, (err, result) => {
            if (err) throw err;

            extract = result.rows;
            that.data.location = objectifyExtract(extract);

            that.wrapUp();
        });
    }

    wrapUp() {
        let maker = new IndexMaker(this.data, this.req);

        this.client.end();
        this.finaliser.protoRender(this.req, this.res, "index", maker);
    }
}

// Gather the necessary data for the new service time form.
class Upload2ServiceTimeScraper extends SuperScraper {
    constructor(req, res, properties) {
        super(req, res);
        this.properties = properties;
    }

    startHere() {
        this.client.connect();
        this.fetchRealWorldAddresses();
    }

    fetchRealWorldAddresses() {
        const queryString =
            "SELECT code, short_name " +
            "FROM RealWorldAddress;";
        let that = this;
        let extract;

        this.client.query(queryString, (err, result) => {
            if (err) throw err;

            extract = result.rows;
            that.data.realWorldAddresses = objectifyExtract(extract);

            that.wrapUp();
        });
    }

    wrapUp() {
console.log(this.data.realWorldAddresses);
        this.properties.data = this.data;
        this.client.end();
        this.finaliser.protoRender(
            this.req, this.res, "upload2ServiceTime", this.properties
        );
    }
}

/**********************
 ** HELPER FUNCTIONS **
 *********************/

// Turn an extract from the database into a useful object.
function objectifyExtract(extract) {
    let columns, rows;
    let result = {};

    if (!extract || extract.length === 0) return null;

    columns = Object.keys(extract[0]);
    rows = dictToRows(extract);

    result.columns = columns;
    result.rows = rows;

    return result;
}

// Extract the rows from a list of dictionaries.
function dictToRows(list) {
    let result = [];
    let row = [];

    for (let i = 0; i < list.length; i++) {
        row = Object.values(list[i]);
        result.push(row);
    }

    return result;
}

// Checks the validity of a given table name.
function checkTableName(tableName, extract) {
    let nameToBeChecked;

    for (let i = 0; i < extract.length; i++) {
        if (extract[i].table_schema === "public") {
            if (tableName.toLowerCase() === extract[i].table_name) {
                return true;
            }
        }

        nameToBeChecked = extract[i].table_schema + "." + extract[i].table_name;

        if (tableName.toLowerCase() === nameToBeChecked) return true;
    }

    return false;
}

// Adds links to foreign keys.
function linkifyExtract(extract, linkField, linkStem) {
    let row;

    for (let i = 0; i < extract.length; i++) {
        row = extract[i];
        // Link stem should end with a "/".
        row[linkField] =
            '<a href="' +
            linkStem +
            row[linkField] +
            '">' +
            row[linkField] +
            "</a>";
    }

    return extract;
}

// Replaces epoch times with ISO formated date strings.
function addISODates(extract) {
    let reee;

    for (let i = 0; i < extract.length; i++) {
        reee = new Date(extract[i].epochtime * MILLISECONDS_IN_A_SECOND);
        extract[i].isoDate = reee.toISOString();
    }

    return extract;
}

// Exports.
module.exports = Scraper;
