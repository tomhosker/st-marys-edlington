/*
This code contains a class which handles any final, universal touches to the
page before it's passed to the browser.
*/

// Local imports.
const MUtils = require("./mutils.js");

// Local constants.
const MOCK_MOST_RECENT_NEWSLETTER_URL =
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

/****************
 ** MAIN CLASS **
 ***************/

// The class in question.
class Finaliser {
    constructor() {
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
            "ORDER BY week_beginning_year DESC, week_beginning_month DESC, " +
            "week_beginning_day DESC, link;";
        let that = this;

        this.properties.mostRecentNewsletterURL =
            MOCK_MOST_RECENT_NEWSLETTER_URL;

        MUtils.attachPool(this.res);

        if (this.res.pool) {
            this.res.pool.query(queryString, function (err, result) {
                if (err) throw err;

                if (result.rows.length > 0) {
                    that.properties.mostRecentNewsletterURL =
                        result.rows[0].link;
                }

                that.deliver();
            });
        } else this.deliver();
    }

    // Gives either a log in or a log out link, as appropriate.
    getLogInOrOut() {
        let result;

        if (this.req.user) result = '<a href="/logout">Log out</a>';
        else result = '<a href="/login">Log in</a>';

        return result;
    }

    // Deliver the page to the browser.
    deliver() {
        const date = new Date();
        let that = this;

        MUtils.killPool(this.res);

        this.properties.footstamp = date.toISOString();
        this.properties.logInOrOut = this.getLogInOrOut();

        this.res.render(this.view, this.properties, function (err, html) {
            if (html) {
                html = Finaliser.fixApostrophes(html);
                that.res.send(html);
            } else that.res.render(that.view, that.properties);
        });
    }
}

// Exports.
module.exports = Finaliser;
