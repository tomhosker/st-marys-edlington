/*
This code contains a class which handles any final, universal touches to the
page before it's passed to the browser.
*/

// Local imports.
const { getRetriever } = require("./retriever.js");

// The class in question.
class Finaliser {
    constructor(retrieverFactory = getRetriever) {
        this.retrieverFactory = retrieverFactory;
    }

    async fetchMostRecentNewsletterLink(retriever) {
        const query = `
            SELECT *
            FROM Newsletter
            ORDER BY week_beginning_year DESC, week_beginning_month DESC,
                week_beginning_day DESC, link;
        `;
        const raw = await retriever.fetchAll(query, []);
        let result;

        if (raw.length === 0) result = null;
        else result = raw[0].link;

        return result;
    }

    // Gather the data from the database which all pages require.
    async gatherData() {
        const retriever = this.retrieverFactory();

        try {
            return {
                mostRecentNewsletterLink:
                    await this.fetchMostRecentNewsletterLink(retriever)
            };
        } finally {
            await retriever.close();
        }
    }

    // Render, and deliver the page to the browser.
    async protoRender(req, res, view, properties = {}) {
        const date = new Date();

        properties.footstamp = date.toISOString();
        properties.loggedIn = req.isAuthenticated();

        properties.globalData = await this.gatherData();

        const html = await new Promise((resolve, reject) => {
            res.render(view, properties, (error, renderedHtml) => {
                if (error) reject(error);
                else resolve(renderedHtml);
            });
        });

        res.send(html);
    }
}

/********************
 * HELPER FUNCTIONS *
 *******************/

// Exports.
module.exports = Finaliser;
