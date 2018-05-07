import {
    SectionChange,
    SiteArea
} from "./enums";

var changes = 0;
var width = window.innerWidth,
    height = window.innerHeight,
    startX = 0,
    moveX = 0;
var activeSection = SiteArea.home,
    prevSection = SiteArea.home,
    activeContent = SiteArea.home;
var startTime, delta = 0;
var initMove = true;
var contentEl = document.getElementById("content"),
    agencyEl = document.createElement("div"),
    collectionEl = document.createElement("div");

// fetch agency and collection html
var httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.responseURL == "http://localhost:8000/agency.html") {
            agencyEl.className = "content__inner";
            agencyEl.innerHTML = httpRequest.responseText;
            httpRequest.open("GET", "/collection.html", true);
            httpRequest.send();
        } else {
            collectionEl.className = "content__inner";
            collectionEl.innerHTML = httpRequest.responseText;
            httpRequest = null;
        }
    }
};
httpRequest.open("GET", "/agency.html", true);
httpRequest.send();

export function navToSection(section: number) {
    prevSection = activeSection;
    activeSection = section;
    changes |= SectionChange.navigate_mask;
    initMove = true;
}

export function markSectionEvent(changeMask) {
    changes |= changeMask;
}

export function updateSections(): boolean {
    if (changes & SectionChange.scroll_mask) {
        changes ^= SectionChange.scroll_mask;
        handleScroll();
    }
    if (changes & SectionChange.resize_mask) {
        changes ^= SectionChange.resize_mask;
        handleResize();
    }
    if (changes & SectionChange.navigate_mask) {
        handleTransition();
    }
    return changes === 0;
}

function initTransition() {
    initMove = false;
    // hide scroll bars when moving
    contentEl.style.overflowY = "hidden";

    // if coming from either size, first move off to side
    if (prevSection === SiteArea.agency) {
        startX = 0;
        moveX = -width;
    } else if (prevSection === SiteArea.collection) {
        startX = 0;
        moveX = width;
    } else {
        contentEl.style.display = "block";
        // if coming from home, move from off screen to 0
        if (activeSection === SiteArea.agency) {
            startX = -width;
            moveX = width;
        } else {
            startX = width;
            moveX = -width;
        }
        // switch content if needed
        if (activeSection !== activeContent) {
            if (contentEl.firstChild)
                contentEl.removeChild(contentEl.firstChild);
            contentEl.appendChild(activeSection === SiteArea.agency ?
                agencyEl : collectionEl);
            activeContent = activeSection;
        }
    }
    startTime = performance.now();
}

function handleTransition() {
    if (initMove) initTransition();
    delta = (performance.now() - startTime) / SectionChange.transition_ms;
    if (delta > 1) {
        // done if moving to home
        if (activeSection === SiteArea.home) {
            changes ^= SectionChange.navigate_mask;
            contentEl.style.display = "none";
        }
        // done if coming from home
        else if (prevSection === SiteArea.home) {
            changes ^= SectionChange.navigate_mask;
            contentEl.style.overflowY = "auto";
            contentEl.style.left = "0";
        }
        // if coming from one side and moving to the other
        // start moving towards other side after moving from prevSide
        else {
            prevSection = SiteArea.home;
            initMove = true;
        }
    } else {
        contentEl.style.left = (startX + (moveX * delta)) + "px";
    }
}

function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;
}

function handleScroll() {

}