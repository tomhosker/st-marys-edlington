const expect = require("expect");

const Finaliser = require("../lib/finaliser.js");

function makeRetriever(rows = []) {
    return {
        closed: false,
        async fetchAll() {
            return rows;
        },
        async close() {
            this.closed = true;
        }
    };
}

describe("Finaliser", function () {
    it("returns the most recent newsletter and closes its retriever", async function () {
        const retriever = makeRetriever([{ link: "/latest.pdf" }]);
        const finaliser = new Finaliser(() => retriever);

        await expect(finaliser.gatherData()).resolves.toEqual({
            mostRecentNewsletterLink: "/latest.pdf"
        });
        expect(retriever.closed).toBe(true);
    });

    it("closes its retriever when a query fails", async function () {
        const retriever = makeRetriever();
        retriever.fetchAll = async () => {
            throw new Error("database unavailable");
        };
        const finaliser = new Finaliser(() => retriever);

        await expect(finaliser.gatherData()).rejects.toThrow(
            "database unavailable"
        );
        expect(retriever.closed).toBe(true);
    });

    it("adds shared page data and sends rendered HTML", async function () {
        const retriever = makeRetriever([]);
        const finaliser = new Finaliser(() => retriever);
        let renderedProperties;
        let sentHtml;
        const req = { isAuthenticated: () => true };
        const res = {
            render(view, properties, callback) {
                renderedProperties = properties;
                callback(null, "<p>Parish--news</p>");
            },
            send(html) {
                sentHtml = html;
            }
        };

        await finaliser.protoRender(req, res, "example", { title: "Example" });

        expect(renderedProperties.loggedIn).toBe(true);
        expect(renderedProperties.globalData).toEqual({
            mostRecentNewsletterLink: null
        });
        expect(renderedProperties.footstamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
        expect(sentHtml).toBe("<p>Parish--news</p>");
    });
});
