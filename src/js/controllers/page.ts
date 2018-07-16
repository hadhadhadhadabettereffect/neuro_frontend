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
    agencyEl = document.getElementById("agency"),
    collectionEl = document.getElementById("collection"),
    contactNavLink  = document.getElementById("nav--contact"),
    homeVideo = document.getElementById("home").querySelector("video") as HTMLVideoElement;
var agencyContactLink = document.getElementById("contact--agency"),
    collectionContactLink = document.getElementById("contact--collection");

// replace state on init for popstate data
history.replaceState({
    page: activeSection
}, pageTitles[activeSection], pageUrls[activeSection]);

agencyEl.remove();
collectionEl.remove();

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
            if (activeSection === LandingPage.agency) {
                collectionEl.remove();
                contentEl.appendChild(agencyEl);
            } else {
                agencyEl.remove();
                contentEl.appendChild(collectionEl);
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
