import { SiteArea, NavMeasure } from "./enums";

const pageTitles = [
    "Neuro Studio", "Neuro Studio | Agency", "Neuro Studio | Collection"
];
// const pageUrls = ["/", "/agency", "/collection"];
const pageUrls = ["/","/","/"];

var activeLink = SiteArea.home;
var changes = 0;
var agencyLinkEl = document.getElementById("nav_agency"),
    collectionLinkEl = document.getElementById("nav_collection"),
    agencyNavEl = document.getElementById("subnav--agency"),
    agencyLinks = <any>agencyNavEl.querySelectorAll(".subnav__item");

// replace state on init for popstate data
history.replaceState({
    page: activeLink
}, pageTitles[activeLink], pageUrls[activeLink]);


// returns true if clicked link is not current area
export function clickNavLink(link: number): boolean {
    if (activeLink !== link) {
        changes |= ((1 << link) | (1 << activeLink));
        activeLink = link;
        return true;
    }
    return false;
}

export function updateNav(): boolean {
    if (changes & SiteArea.home_mask) {
        changes ^= SiteArea.home_mask;
    }
    if (changes & SiteArea.agency_mask) {
        changes ^= SiteArea.agency_mask;
        if (activeLink === SiteArea.agency) {
            agencyLinkEl.className = "nav__link--side nav__link--active";
            agencyLinks[0].style.left = NavMeasure.link_a + "px";
            agencyLinks[1].style.left = NavMeasure.link_b + "px";
            agencyLinks[2].style.left = NavMeasure.link_c + "px";
            agencyLinks[3].style.left = NavMeasure.link_d + "px";
        } else {
            agencyLinkEl.className = "nav__link--side";
            agencyLinks[0].style.left = "0";
            agencyLinks[1].style.left = "0";
            agencyLinks[2].style.left = "0";
            agencyLinks[3].style.left = "0";
        }
    }
    if (changes & SiteArea.collection_mask) {
        changes ^= SiteArea.collection_mask;
        if (activeLink === SiteArea.collection) {
            collectionLinkEl.className = "nav__link--side nav__link--active";
        } else {
            collectionLinkEl.className = "nav__link--side";
        }
    }

    history.pushState({
        page: activeLink
    }, pageTitles[activeLink], pageUrls[activeLink]);

    return true;
}