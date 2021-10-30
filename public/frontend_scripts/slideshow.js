/*
This is a front end script which defines a class modelling a slideshow.
*/

// Constants.
const DEFAULT_TIMEOUT = 5000;

// The class in question.
class Slideshow {
    constructor() {
        this.slides = document.getElementsByClassName("mySlides");
        this.slideIndex = 0;
    }

    // Go to the next slide.
    nextSlide() {
        for (let i = 0; i < this.slides.length; i++) {
            this.slides[i].style.display = "none";
        }
        if (this.slideIndex >= this.slides.length) this.slideIndex = 0;
        this.slides[this.slideIndex].style.display = "block";  
        this.slideIndex++;
    }
}

// Helper function.
function runTheSlideshow(slideshow) {
    slideshow.nextSlide();
    setTimeout(runTheSlideshow, DEFAULT_TIMEOUT, slideshow);
}

// Let's get cracking...
const theSlideshow = new Slideshow();
runTheSlideshow(theSlideshow);

/*
var slideIndex = 0;
showSlides();

function showSlides() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) slideIndex = 1;
    slides[slideIndex-1].style.display = "block";  
    setTimeout(showSlides, 5000); // Change image every 5 seconds
}
*/
