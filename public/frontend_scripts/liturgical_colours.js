/*
This is a front end script which changes the colours of elements according to
the current liturgical colour.
*/

// A helper function.
function recolorElements(elementList, newClassName) {
    for (let i = 0; i < elementList.length; i++) {
        //elementList[i].className = newClassName;
    }
}

// The class in question.
class ColorChanger {
    constructor() {
        this.litColor = "green";
        this.litBackgrounds =
            document.getElementsByClassName("liturgical-background");
        this.litBorders = document.getElementsByClassName("liturgical-border");
    }

    // Change the colour of each element.
    changeColors() {
        recolorElements(this.litBackgrounds, this.litColor+"-background");
        recolorElements(this.litBorders, this.litColor+"-border");
    }
}

// Let's get cracking...
const colorChanger = new ColorChanger();
colorChanger.changeColors();
