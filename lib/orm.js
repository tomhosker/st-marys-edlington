/*
This code holds a class which retrieves the required data from a database.
ORM = Object Relational Model, i.e. a class which models database data.
*/

// Local imports.
const SuperORM = require("./super_orm.js");
const MUtils = require("./mutils.js");
const IndexMaker = require("./index_maker.js");
const DeleteFromServiceTimeMaker =
    require("./delete_from_service_time_maker.js");

/****************
 ** MAIN CLASS **
 ***************/

class ORM extends SuperORM {
    constructor(req, res) {
        super(req, res);
    }

    fetchAsIs() {
        const tableName = this.req.params.id;

        this.checkTableName(tableName);
    }

    checkTableName(tableName) {
        const queryString =
            "SELECT table_schema, table_name " +
            "FROM information_schema.tables " +
            "WHERE table_type = 'BASE TABLE';";

        this.runQuery(queryString, [], "fetchAsIsPart2", [tableName]);
    }

    fetchAsIsPart2(tableName, tableNameList) {
        const queryString = "SELECT * FROM " + tableName + ";";

        if (checkTableNameAgainstList(tableName, tableNameList)) {
            this.runQuery(queryString, [], "fetchAsIsPart3", [tableName]);
        } else res.send("Bad table name: " + tableName);
    }

    fetchAsIsPart3(tableName, extract) {
        const view = "asis";
        const data = objectifyExtract(extract);
        const properties = { title: tableName, data: data };

        this.finaliser.protoRender(this.req, this.res, view, properties);
    }

    getIndex() {
        let orm = new IndexORM(this.req, this.res);

        orm.startHere();
    }

    getUpload2ServiceTime(properties) {
        let orm = new Upload2ServiceTimeORM(this.req, this.res, properties);

        orm.startHere();
    }

    getDeleteFromServiceTime(action) {
        let orm = new DeleteFromServiceTimeORM(this.req, this.res, action);

        orm.startHere();
    }

    getDeleteFromNewsletter(action) {
        let orm = new DeleteFromNewsletterORM(this.req, this.res, action);

        orm.startHere();
    }

    getNewsletters() {
        let orm = new NewslettersORM(this.req, this.res);

        orm.startHere();
    }

    getWebmaster() {
        let orm = new WebmasterORM(this.req, this.res);

        orm.startHere();
    }

    getPilgrimages() {
        let orm = new PilgrimagesORM(this.req, this.res);

        orm.startHere();
    }

    getYouth() {
        let orm = new YouthORM(this.req, this.res);

        orm.startHere();
    }
}

/********************
 ** HELPER CLASSES **
 *******************/

// Gather the neccessary data for the site's home page.
class IndexORM extends SuperORM {
    constructor(req, res) {
        super(req, res);
    }

    startHere() {
        this.fetchServiceTimes();
    }

    fetchServiceTimes() {
        const queryString =
            "SELECT id, weekday, hours, minutes, service_type, day, " +
            "month, year, remarks, RealWorldAddress.short_name AS "+
            "location_name " +
            "FROM ServiceTime " +
            "JOIN RealWorldAddress ON RealWorldAddress.code = " +
            "ServiceTime.location " +
            "ORDER BY weekday ASC, year, month, day, hours ASC, "+
            "minutes ASC;";

        this.runQuery(queryString, [], "fetchServiceTimesPart2", []);
    }

    fetchServiceTimesPart2(extract) {
        this.data.serviceTimes = objectifyExtract(extract);

        this.fetchParishPriest();
    }

    fetchParishPriest(serviceTimes) {
        const queryString =
            "SELECT Contact.*, RealWorldAddress.short_name AS " +
            "address_name " +
            "FROM ParishRole " +
            "JOIN Contact ON Contact.code = ParishRole.contact " +
            "JOIN RealWorldAddress ON RealWorldAddress.code = " +
            "Contact.address " +
            "WHERE ParishRole.code = 'parish-priest';";

        this.runQuery(queryString, [], "fetchParishPriestPart2", []);
    }

    fetchParishPriestPart2(extract) {
        this.data.parishPriest = objectifyExtract(extract);

        this.fetchLocations();
    }

    fetchLocations() {
        const queryString =
            "SELECT * " +
            "FROM RealWorldAddress " +
            "WHERE code = 'st-marys-edlington' " +
            "OR code = 'sacred-heart-balby' " +
            "ORDER BY short_name;";

        this.runQuery(queryString, [], "fetchLocationsPart2", []);
    }

    fetchLocationsPart2(extract) {
        this.data.location = objectifyExtract(extract);

        this.fetchNewsletters();
    }

    fetchNewsletters() {
        const queryString =
            "SELECT * " +
            "FROM Newsletter " +
            "ORDER BY week_beginning_year DESC, week_beginning_month DESC, "+
            "week_beginning_day DESC, link;";

        this.runQuery(queryString, [], "fetchNewslettersPart2", []);
    }

    fetchNewslettersPart2(extract) {
        this.data.newsletters = objectifyExtract(extract);

        this.wrapUp();
    }

    wrapUp() {
        let maker = new IndexMaker(this.data, this.req);

        this.finaliser.protoRender(this.req, this.res, "index", maker);
    }
}

// Gather the necessary data for the new service time form.
class Upload2ServiceTimeORM extends SuperORM {
    constructor(req, res, properties) {
        super(req, res);
        this.properties = properties;
    }

    startHere() {
        this.fetchRealWorldAddresses();
    }

    fetchRealWorldAddresses() {
        const queryString =
            "SELECT code, short_name " +
            "FROM RealWorldAddress;";

        this.runQuery(queryString, [], "fetchRealWorldAddressesPart2", []);
    }

    fetchRealWorldAddressesPart2(extract) {
        this.data.realWorldAddresses = objectifyExtract(extract);

        this.wrapUp();
    }

    wrapUp() {
        this.properties.data = this.data;
        this.finaliser.protoRender(
            this.req, this.res, "upload2ServiceTime", this.properties
        );
    }
}

// Gather the necessary data for the delete service time form.
class DeleteFromServiceTimeORM extends SuperORM {
    constructor(req, res, action) {
        super(req, res);
        this.action = action;
    }

    startHere() {
        this.fetchServiceTimes();
    }

    fetchServiceTimes() {
        const queryString =
            "SELECT id, weekday, hours, minutes, service_type, day, " +
            "month, year, remarks, RealWorldAddress.short_name AS "+
            "location_name " +
            "FROM ServiceTime " +
            "JOIN RealWorldAddress ON RealWorldAddress.code = " +
            "ServiceTime.location " +
            "ORDER BY weekday ASC, year, month, day, hours ASC, "+
            "minutes ASC;";

        this.runQuery(queryString, [], "fetchServiceTimesPart2", []);
    }

    fetchServiceTimesPart2(extract) {
        this.data.serviceTimes = objectifyExtract(extract);

        this.wrapUp();
    }

    wrapUp() {
        let maker = new DeleteFromServiceTimeMaker(this.data, this.action);

        this.finaliser.protoRender(
            this.req, this.res, "deletefromServiceTime", maker
        );
    }
}

// Gather the necessary data for the newsletters page.
class NewslettersORM extends SuperORM {
    constructor(req, res) {
        super(req, res);
    }

    startHere() {
        this.fetchNewsletters();
    }

    fetchNewsletters() {
        const queryString =
            "SELECT * " +
            "FROM Newsletter " +
            "ORDER BY week_beginning_year DESC, week_beginning_month DESC, "+
            "week_beginning_day DESC, link;";

        this.runQuery(queryString, [], "fetchNewslettersPart2", []);
    }

    fetchNewslettersPart2(extract) {
        this.data.newsletters = objectifyExtract(extract);

        this.wrapUp();
    }

    wrapUp() {
        const properties = {
            title: "Newsletters",
            newsletters: makeNewsletters(this.data.newsletters)
        }

        this.finaliser.protoRender(
            this.req, this.res, "newsletters", properties
        );
    }
}

// Gather the necessary data for the delete newsletters form.
class DeleteFromNewsletterORM extends SuperORM {
    constructor(req, res, action) {
        super(req, res);
        this.action = action;
    }

    startHere() {
        this.fetchNewsletters();
    }

    fetchNewsletters() {
        const queryString =
            "SELECT * " +
            "FROM Newsletter " +
            "ORDER BY week_beginning_year DESC, week_beginning_month DESC, "+
            "week_beginning_day DESC, link;";

        this.runQuery(queryString, [], "fetchNewslettersPart2", []);
    }

    fetchNewslettersPart2(extract) {
        this.data.newsletters = objectifyExtract(extract);

        this.wrapUp();
    }

    wrapUp() {
        const properties = {
            title: "Delete a Newsletter",
            formAction: this.action,
            newsletterSummaries:
                makeNewsletterSummaries(this.data.newsletters)
        };

        this.finaliser.protoRender(
            this.req, this.res, "deletefromNewsletter", properties
        );
    }
}

// Gather the necessary data for the webmaster page.
class WebmasterORM extends SuperORM {
    constructor(req, res) {
        super(req, res);
    }

    startHere() {
        this.fetchWebmaster();
    }

    fetchWebmaster() {
        const queryString =
            "SELECT Contact.* "+
            "FROM ParishRole "+
            "JOIN Contact ON Contact.code = ParishRole.contact "+
            "WHERE ParishRole.code = 'computer-guy';";

        this.runQuery(queryString, [], "fetchWebmasterPart2", []);
    }

    fetchWebmasterPart2(extract) {
        this.data.webmaster = objectifyExtract(extract);

        this.wrapUp();
    }

    wrapUp() {
        let properties = { title: "Webmaster" };
        let rowObj;

        if(this.data.webmaster.rows.length === 1) {
            rowObj =
                MUtils.objectifyRow(
                    this.data.webmaster.columns,
                    this.data.webmaster.rows[0]);
            properties.webmasterAppointed = true;
            properties.fullName = rowObj.full_name;
            properties.shortName = rowObj.short_name;
            properties.email = rowObj.email;
            properties.landline = rowObj.landline;
            properties.mobile = rowObj.mobile;
        } else {
            properties.webmasterAppointed = false;
        }

        this.finaliser.protoRender(
            this.req, this.res, "webmaster", properties
        );
    }
}

// Gather the necessary data for the pilgrimages page.
class PilgrimagesORM extends SuperORM {
    constructor(req, res) {
        super(req, res);
    }

    startHere() {
        this.fetchPilgrimages();
    }

    fetchPilgrimages() {
        const queryString = "SELECT * FROM Pilgrimage;";

        this.runQuery(queryString, [], "fetchPilgrimagesPart2", []);
    }

    fetchPilgrimagesPart2(extract) {
        this.data.pilgrimages = objectifyExtract(extract);

        this.processPilgrimages();
    }

    processPilgrimages() {
        const currentDateObj = new Date();
        const currentYear = currentDateObj.getFullYear();
        const currentMonth = currentDateObj.getMonth();
        const currentDay = currentDateObj.getDate();
        let pilgrimage, row;

        this.pilgrimages = [];

        for (let i = 0; i < this.data.pilgrimages.length; i++) {
            row = this.data.pilgrimages[i];

            // Filter out pilgrimages which have already finished.
            if (row.end_year) {
                if (row.end_year < currentYear) continue;

                if (row.end_month && row.end_day) {
                    if (row.end_year === currentYear) {
                        if (row.end_month < currentMonth) continue;

                        if (row.end_month === currentMonth) {
                            if (row.end_day < currentDay) continue;
                        }
                    }
                }
            }

            pilgrimage = {};
            pilgrimage.destination = row.destination;
            pilgrimage.title = makePilgrimageTitle(row);
            pilgrimage.start =
                MUtils.makeDayMonthString(row.start_day, row.start_month);
            pilgrimage.end =
                MUtils.makeDayMonthString(row.end_day, row.end_month);
            pilgrimage.email = row.email;
            pilgrimage.telephone = row.telephone;
            pilgrimage.otherText = row.other_text;
            this.pilgrimages.push(pilgrimage);
        }

        this.wrapUp();
    }

    wrapUp() {
        let properties = {
            title: "Pilgrimages", pilgrimages: this.pilgrimages
        };

        this.finaliser.protoRender(
            this.req, this.res, "pilgrimages", properties
        );
    }
}

// Gather the necessary data for the main youth page.
class YouthORM extends SuperORM {
    constructor(req, res) {
        super(req, res);
    }

    startHere() {
        this.fetchChildrensLiturgies();
    }

    fetchChildrensLiturgies() {
        const queryString = 
            "SELECT "+
                "ServiceTime.*, RealWorldAddress.short_name AS locationName "+
            "FROM ServiceTime "+
            "JOIN RealWorldAddress "+
                "ON RealWorldAddress.code = ServiceTime.location "+
            "WHERE has_childrens_liturgy = true;";

        this.runQuery(queryString, [], "fetchChildrensLiturgiesPart2", []);
    }

    fetchChildrensLiturgiesPart2(extract) {
        this.processChildrensLiturgies();
    }

    processChildrensLiturgies() {
        let item;

        this.childrensLiturgies = [];

console.log("this.data.childrensLiturgies:");
console.log(this.data.childrensLiturgies);

        for (let i = 0; i < this.data.childrensLiturgies.length; i++) {
            item = this.data.childrensLiturgies[i];
            item.time =
                MUtils.makeWhenString(
                    item.weekday,
                    item.day,
                    item.month,
                    item.year,
                    item.hours,
                    item.minutes
                );
            this.childrensLiturgies.push(item);
        }

        this.wrapUp();
    }

    wrapUp() {
console.log("this.childrensLiturgies:");
console.log(this.childrensLiturgies);

        let properties = {
            title: "Youth", childrensLiturgies: this.childrensLiturgies
        };

        this.finaliser.protoRender(
            this.req, this.res, "youth", properties
        );
    }
}

/**********************
 ** HELPER FUNCTIONS **
 *********************/

// Turn an extract from the database into a useful object.
function objectifyExtract(extract) {
    let result = { columns: [], rows: [] };

    if (!extract) return null;
    if (extract.length === 0) return result;

    result.columns = Object.keys(extract[0]);
    result.rows = dictToRows(extract);

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
function checkTableNameAgainstList(tableName, list) {
    let nameToBeChecked;

    for (let i = 0; i < list.length; i++) {
        if (list[i].table_schema === "public") {
            if (tableName.toLowerCase() === list[i].table_name) {
                return true;
            }
        }

        nameToBeChecked = list[i].table_schema + "." + list[i].table_name;

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

function makeNewsletters(data) {
    let result = [];
    let newsletter, objectifiedRow, weekBeginning;

    if(!data) return [];

    for(let i = 0; i < data.rows.length; i++) {
        objectifiedRow = MUtils.objectifyRow(data.columns, data.rows[i]);
        weekBeginning =
            MUtils.makeMyDateFormat(
                objectifiedRow.week_beginning_day,
                objectifiedRow.week_beginning_month,
                objectifiedRow.week_beginning_year
            );
        newsletter = {
            id: objectifiedRow.id,
            weekBeginning: weekBeginning,
            link: objectifiedRow.link
        };
        result.push(newsletter);
    }

    return result;
}

function makeNewsletterSummaries(data) {
    let result = [];
    let description, summary, objectifiedRow, weekBeginning;

    if(!data) return [];

    for(let i = 0; i < data.rows.length; i++) {
        objectifiedRow = MUtils.objectifyRow(data.columns, data.rows[i]);
        weekBeginning =
            MUtils.makeMyDateFormat(
                objectifiedRow.week_beginning_day,
                objectifiedRow.week_beginning_month,
                objectifiedRow.week_beginning_year
            );
        description = 
            "{ weekBeginning: "+weekBeginning+", "+
            "id: "+objectifiedRow.id+" }";
        summary = { id: objectifiedRow.id, description: description };
        result.push(summary);
    }

    return result;
}

function makePilgrimageTitle(row) {
    let result = row.destination;

    if (!row.end_year) return result;

    if (row.start_day && row.start_month && row.end_day && row.end_month) {
        if (row.start_month > row.end_month) {
            result = 
                result+
                " (concluding "+
                MUtils.makeMyDateFormat(
                    row.end_day, row.end_month, row.end_year
                )+
                ")";
            return result;
        }
    }

    result = result+" "+row.end_year.toString();

    return result;
}

// Exports.
module.exports = ORM;
