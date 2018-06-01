import { LandingPage } from "../constants/groups";
import { TransitionMS } from "../constants/options";


const pageTitles = [
    "Neuro Studio", "Neuro Studio | Agency", "Neuro Studio | Collection"
];
const pageUrls = process.env.NODE_ENV === "production" ?
    ["/", "/agency", "/collection"] : ["/","/","/"];
var width = window.innerWidth,
    startX = 0,
    moveX = 0;
var activeSection = LandingPage.home,
    prevSection = LandingPage.home,
    activeContent = LandingPage.home;
var startTime, delta = 0;
var isAnimating = false,
    initMove = true;
var wrapEl = document.getElementById("wrap"),
    contentEl = document.getElementById("content"),
    agencyEl = document.createElement("div"),
    collectionEl = document.createElement("div"),
    homeVideo = document.getElementById("home").querySelector("video") as HTMLVideoElement;

// fetch agency and collection html
var fetchAgency = new XMLHttpRequest();
fetchAgency.onreadystatechange = function () {
    if (fetchAgency.readyState === XMLHttpRequest.DONE) {
        agencyEl.innerHTML = fetchAgency.responseText;
        let photos = agencyEl.querySelectorAll(".staff__photo");
        for (let i = 0; i < 4; ++i) {
            (photos[i] as HTMLImageElement).src = "https://placeimg.com/140/140/animals?t=" +
                Date.now() + i;
        }
    }
};
fetchAgency.open("GET", "/agency.html", true);
fetchAgency.send();

var fetchCollection = new XMLHttpRequest();
fetchCollection.onreadystatechange = function () {
    if (fetchCollection.readyState === XMLHttpRequest.DONE) {
        collectionEl.innerHTML = fetchCollection.responseText;
    }
};
fetchCollection.open("GET", "/collection.html", true);
fetchCollection.send();

// replace state on init for popstate data
history.replaceState({
    page: activeSection
}, pageTitles[activeSection], pageUrls[activeSection]);

export function updateWidth() {
    width = window.innerWidth;
}

export function navToSection(section: number): boolean {
    if (section === activeSection) return false;
    prevSection = activeSection;
    activeSection = section;
    initMove = true;
    isAnimating = true;

    history.pushState({
        page: section
    }, pageTitles[section], pageUrls[section]);
    return true;
}

export function updateContent(): boolean {
    // mpve btw agency, home, collection areas
    if (isAnimating) handleTransition();
    return !isAnimating;
}

function initTransition() {
    initMove = false;
    // hide scroll bars when moving
    contentEl.style.overflowY = "hidden";

    // if coming from either size, first move off to side
    if (prevSection === LandingPage.agency) {
        startX = 0;
        moveX = -width;
    } else if (prevSection === LandingPage.collection) {
        startX = 0;
        moveX = width;
    } else {
        homeVideo.pause();
        wrapEl.style.display = "block";
        // if coming from home, move from off screen to 0
        if (activeSection === LandingPage.agency) {
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
            contentEl.appendChild(activeSection === LandingPage.agency ?
                agencyEl : collectionEl);
            activeContent = activeSection;
            contentEl.scrollTop = 0;
        }
    }
    startTime = performance.now();
}

function handleTransition() {
    if (initMove) initTransition();
    delta = (performance.now() - startTime) / TransitionMS.landing;
    if (delta > 1) {
        // done if moving to home
        if (activeSection === LandingPage.home) {
            isAnimating = false;
            wrapEl.style.display = "none";
            homeVideo.play();
        }
        // done if coming from home
        else if (prevSection === LandingPage.home) {
            isAnimating = false;
            contentEl.style.overflowY = "auto";
            wrapEl.style.transform = "translateX(0)";
            prevSection = activeSection;
            homeVideo.pause();
            contentEl.querySelector("video").play();
        }
        // if coming from one side and moving to the other
        // start moving towards other side after moving from prevSide
        else {
            prevSection = LandingPage.home;
            initMove = true;
        }
    } else {
        wrapEl.style.transform = "translateX(" + (startX + (moveX * delta)) + "px)";
    }
}
