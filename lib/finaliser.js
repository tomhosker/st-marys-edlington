/*
This code contains a class which handles any final, universal touches to the
page before it's passed to the browser.
*/

// Imports.
const PG = require("pg");

// Local constant objects.
const Client = PG.Client;

// The class in question.
class Finaliser {
    constructor() {
        this.client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: { require: true, rejectUnauthorized: false },
        });
        this.req = null;
        this.res = null;
        this.view = null;
        this.properties = null;
    }

    // Ronseal.
    static fixApostrophes(input) {
        while (input.indexOf("``") >= 0) {
            input = input.replace("``", "&ldquo;");
        }
        while (input.indexOf("''") >= 0) {
            input = input.replace("''", "&rdquo;");
        }
        while (input.indexOf("`") >= 0) {
            input = input.replace("`", "&lsquo;");
        }
        while (input.indexOf("'") >= 0) {
            input = input.replace("'", "&rsquo;");
        }
        return input;
    }

    // Gives either a log in or a log out link, as appropriate.
    static getLogInOrOut(req) {
        let result;

        if (req.user) result = '<a href="/logout">Log out</a>';
        else result = '<a href="/login">Log in</a>';

        return result;
    }

    // Call the end() method on the client object.
    closeClient() {

    }

    // An alternative name for the below.
    protoRender(req, res, view, properties) {
        this.finalise(req, res, view, properties);
    }

    // Gather essential data; render; deliver the page to the browser.
    finalise(req, res, view, properties) {
        this.req = req;
        this.res = res;
        this.view = view;
        this.properties = properties;

        this.gatherData();
    }

    // Get the URL for the most recent newsletter.
    gatherData() {
        const queryString =
            "SELECT * " +
            "FROM Newsletter " +
            "ORDER BY week_beginning_year DESC, week_beginning_month DESC, "+
            "week_beginning_day DESC, link;";
        let that = this;

        this.properties.mostRecentNewsletterURL = null;

        this.client.connect();
        this.client.query(queryString, (err, result) => {
            if (err) throw err;

            if (result.rows.length > 0) {
                that.properties.mostRecentNewsletterURL = result.rows[0].link;
            }

            that.deliver();
        });
    }

    // Deliver the page to the browser.
    deliver() {
        const date = new Date();
        let that = this;

        this.properties.footstamp = date.toISOString();
        this.properties.logInOrOut = Finaliser.getLogInOrOut(this.req);

        this.res.render(this.view, this.properties, function (err, html) {
            if (html) {
                html = Finaliser.fixApostrophes(html);
                that.res.send(html);
            } else {
                that.res.render(that.view, that.properties);
            }
        });
    }
}

// Exports.
module.exports = Finaliser;
