/*
This code contains a class which handles any final, universal touches to the
page before it's passed to the browser.
*/

// Local imports.
const {getRetriever} = require("./retriever.js");

// The class in question.
class Finaliser {
    constructor() {
        this.retriever = null;
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

    // Ronseal.
    static fixDashes(input) {
        while (input.indexOf("---") >= 0) {
            input = input.replace("---", "&mdash;");
        }
        while (input.indexOf("--") >= 0) {
            input = input.replace("--", "&ndash;");
        }

        return input;
    }

    async fetchMostRecentNewsletterLink() {
        const query = `
            SELECT *
            FROM Newsletter
            ORDER BY week_beginning_year DESC, week_beginning_month DESC,
                week_beginning_day DESC, link;
        `;
        const raw = await this.retriever.fetchAll(query, []);
        let result;

        if (raw.length === 0) result = null;
        else result = raw[0].link;

        return result;
    }

    // Gather the data from the database which all pages require.
    async gatherData() {
        let result = {};

        this.retriever = getRetriever();

        result.mostRecentNewsletterLink =
            await this.fetchMostRecentNewsletterLink();

        this.retriever.close();

        return result;
    }

    // Render, and deliver the page to the browser.
    protoRender(req, res, view, properties) {
        const date = new Date();

        properties.footstamp = date.toISOString();
        properties.loggedIn = req.isAuthenticated();

        this.gatherData().then((data) => {
            properties.globalData = data;

            res.render(view, properties, (_, html) => {
                if (html === undefined) {
                    res.render(view, properties);
                } else {
                    html = Finaliser.fixApostrophes(html);
                    html = Finaliser.fixDashes(html);
                    res.send(html);
                }
            });
        });
    }
}

/********************
 * HELPER FUNCTIONS *
 *******************/

// Exports.
module.exports = Finaliser;
