/*
This is a front end script which changes the colours of elements according to
the current liturgical colour.
*/

// The class in question.
class ColourChanger {
    constructor() {
        this.helpboxes = document.getElementsByClassName("helpbox");
    }

    // Change the colour of each element.
    changeColours() {
        for (let i = 0; i < this.helpboxes.length; i++) {
            console.log(this.helpboxes[i].className);
            this.helpboxes[i].className = "helpbox-green";
            console.log(this.helpboxes[i]);
        }
    }
}

// Let's get cracking...
const colourChanger = new ColourChanger();
colourChanger.changeColours();
