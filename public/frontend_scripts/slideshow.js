/*
This is a front end script which defines a class modelling a slideshow.
*/

// Constants.
const DEFAULT_TIMEOUT = 5000;
const DIV_ID_LIST = ["mySlides", "mySlidesBatch2"];

// The class in question.
class Slideshow {
    constructor(divIDs) {
        this.divIDs = divIDs;
        this.slideBatches = this.makeSlideBatches();
        this.maxBatchLength = this.getMaxBatchLength();
        this.slideIndex = 0;
    }

    // Make a list of the batches of slide objects.
    makeSlideBatches() {
        let result = [];
        let batch;

        for (let i = 0; i < this.divIDs.length; i++) {
            batch = document.getElementsByClassName(this.divIDs[i]);

            if (batch.length > 0) result.push(batch);
        }

        return result;
    }

    // Get the maximum length of a batch of slides.
    getMaxBatchLength() {
        let batchLength;
        let result = 0;

        for (let i = 0; i < this.slideBatches.length; i++) {
            batchLength = this.slideBatches[i].length;

            if (batchLength > result) result = batchLength;
        }

        return result;
    }

    // Go to the next slide, for each batch.
    nextSlide() {
        let slides;
        let localIndex;
        let localNextIndex;

        for (let i = 0; i < this.slideBatches.length; i++) {
            slides = this.slideBatches[i];
            localIndex = this.slideIndex % slides.length;
            localNextIndex = (localIndex + 1) % slides.length;

            console.log(slides);
            console.log(slides.length);
            console.log(localIndex);

            slides[localIndex].style.display = "none";
            slides[localNextIndex].style.display = "block";
        }

        this.slideIndex = (this.slideIndex + 1) % this.maxBatchLength;
    }
}

// Helper function.
function runTheSlideshow(slideshow) {
    slideshow.nextSlide();
    setTimeout(runTheSlideshow, DEFAULT_TIMEOUT, slideshow);
}

// Let's get cracking...
const theSlideshow = new Slideshow(DIV_ID_LIST);
runTheSlideshow(theSlideshow);
