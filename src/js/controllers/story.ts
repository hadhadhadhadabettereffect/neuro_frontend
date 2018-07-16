declare const enum StoryUpdate {
    _slider,
    _page,

    slider = 1 << _slider,
    page = 1 << _page,
}

const pageContent = document.createElement("div");
const topImg = document.createElement("div");
var currentPage = 0;
var updates = 0;
var x0 = 0, x1 = 0;

var baseWidth = 400;
var maxWidth = 800;
var width = 400;

export function setStoryPage(page: number) {
    currentPage = page;
    updates |= StoryUpdate.page;
}

export function startSlider(event) {
    x0 = event.clientX;
    updates |= StoryUpdate.slider;
    window.addEventListener("mousemove", handleMouseMove, false);
    window.addEventListener("mouseup", handleMouseUp, false);
}

export function updateStory(): boolean {
    if (updates & StoryUpdate.slider) {
        updateSlider();
    }
    if (updates & StoryUpdate.page) {
        changePage();
        updates ^= StoryUpdate.page;
    }
    return updates === 0;
}

function updateSlider() {
    let diff = x1 - x0;
    width = baseWidth + diff;
    if (width < 0) width = 0;
    else if (width > maxWidth) width = maxWidth;
    topImg.style.width = width + "px";

}

function changePage() {
    pageContent.style.left = currentPage + "00%";
}

function handleMouseMove(event: MouseEvent) {
    x1 = event.clientX;
}

function handleMouseUp() {
    window.removeEventListener("mousemove", handleMouseMove, false);
    window.removeEventListener("mouseup", handleMouseUp, false);
    if (updates & StoryUpdate.slider)
        updates ^= StoryUpdate.slider;
}