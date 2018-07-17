import { LandingPage } from "../constants/groups";
import { TransitionMS } from "../constants/options";


declare var NEURO;

const pageTitles = [
    "Neuro Studio | Agency", "Neuro Studio | Collection", "Neuro Studio"
];
const pageUrls = ["/agency", "/collection", "/"];
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
    agencyEl = document.getElementById("agency"),
    collectionEl = document.getElementById("collection"),
    contactNavLink  = document.getElementById("nav--contact"),
    agencyContactLink = document.getElementById("contact--agency"),
    collectionContactLink = document.getElementById("contact--collection");
var videos = [null, null, null];

if (NEURO.videos[LandingPage.agency]) {
    videos[LandingPage.agency] = document.querySelector("#agency video") as HTMLVideoElement;
    videos[LandingPage.agency].src = NEURO.videos[LandingPage.agency] + ".mp4";
}
if (NEURO.videos[LandingPage.collection]) {
    videos[LandingPage.collection] = document.querySelector("#collection video") as HTMLVideoElement;
    videos[LandingPage.collection].src = NEURO.videos[LandingPage.collection] + ".mp4";
}
if (NEURO.videos[LandingPage.home]) {
    videos[LandingPage.home] = document.querySelector("#home video") as HTMLVideoElement;
    videos[LandingPage.home].src = NEURO.videos[LandingPage.home] + ".mp4";
}

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
    // swap local contact btn for global
    contactNavLink.style.display = "block";

    if (videos[prevSection] !== null) videos[prevSection].pause();

    // if coming from either size, first move off to side
    if (prevSection === LandingPage.agency) {
        startX = 0;
        moveX = -width;
    } else if (prevSection === LandingPage.collection) {
        startX = 0;
        moveX = width;
    } else {
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
            if (activeSection === LandingPage.agency) {
                // collectionEl.remove();
                collectionEl.style.display = "none";
                agencyEl.style.display = "block";
                // contentEl.appendChild(agencyEl);
            } else {
                collectionEl.style.display = "block";
                agencyEl.style.display = "none";
                // agencyEl.remove();
                // contentEl.appendChild(collectionEl);
            }
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
        if (videos[activeSection] !== null) videos[activeSection].play();
        // done if moving to home
        if (activeSection === LandingPage.home) {
            isAnimating = false;
            wrapEl.style.display = "none";
        }
        // done if coming from home
        else if (prevSection === LandingPage.home) {
            isAnimating = false;
            contentEl.style.overflowY = "auto";
            wrapEl.style.transform = "translateX(0)";
            prevSection = activeSection;
            contactNavLink.style.display = "none";
            agencyContactLink.style.visibility = "visible";
            collectionContactLink.style.visibility = "visible";
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
