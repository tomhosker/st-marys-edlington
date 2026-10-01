// Keep the parish calendar local: no network request is needed for the theme.
const RomCal = require("romcal");

function applyLiturgicalTheme(today = new Date()) {
    try {
        // Preview a palette for this page only; ordinary visits use the calendar.
        const preview = new URLSearchParams(window.location.search).get("liturgical-preview");
        if (["green", "purple", "red", "rose", "white", "gold"].includes(preview)) {
            document.documentElement.dataset.liturgicalColour = preview;
            return;
        }
        // Use the parish date even when a visitor is in another time zone.
        const parts = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Europe/London",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).formatToParts(today);
        const part = (type) => parts.find((value) => value.type === type).value;
        const date = `${part("year")}-${part("month")}-${part("day")}`;
        const calendar = RomCal.calendarFor({
            year: Number(part("year")),
            country: "england",
        });
        const day = calendar.find((entry) => entry.moment.slice(0, 10) === date);
        const colour = day && day.data.meta.liturgicalColor.key.toLowerCase();
        if (["green", "purple", "red", "rose", "white", "gold"].includes(colour)) {
            document.documentElement.dataset.liturgicalColour = colour;
        }
    } catch (error) {
        // The neutral default palette remains usable if calendar data is unavailable.
        console.warn("Unable to apply the liturgical colour.", error);
    }
}

applyLiturgicalTheme();
