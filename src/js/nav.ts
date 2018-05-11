import { SiteArea, NavMeasure } from "./enums";

var activeLink = SiteArea.home;
var changes = 0;
var agencyLinkEl = document.getElementById("nav_agency"),
    collectionLinkEl = document.getElementById("nav_collection"),
    agencyNavEl = document.getElementById("subnav--agency"),
    agencyLinks = <any>agencyNavEl.querySelectorAll(".subnav__item");

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
    if (changes & SiteArea.home_mask) changes ^= SiteArea.home_mask;
    if (changes & SiteArea.agency_mask) {
        if (activeLink === SiteArea.agency) {
            agencyLinkEl.style.cursor = "default";
            agencyLinkEl.style.color = "blue";
            agencyLinks[0].style.left = NavMeasure.link_a + "px";
            agencyLinks[1].style.left = NavMeasure.link_b + "px";
            agencyLinks[2].style.left = NavMeasure.link_c + "px";
            agencyLinks[3].style.left = NavMeasure.link_d + "px";
        } else {
            agencyLinkEl.style.cursor = "pointer";
            agencyLinkEl.style.color = "white";
            agencyLinks[0].style.left = "0";
            agencyLinks[1].style.left = "0";
            agencyLinks[2].style.left = "0";
            agencyLinks[3].style.left = "0";
        }
        changes ^= SiteArea.agency_mask;
    }
    if (changes & SiteArea.collection_mask) {
        collectionLinkEl.className = (activeLink === SiteArea.collection) ?
            "nav__link--active" : "nav__link";
        changes ^= SiteArea.collection_mask;
    }
    return true;
}