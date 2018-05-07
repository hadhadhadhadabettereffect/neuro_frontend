import { SiteArea } from "./enums";

var activeLink = SiteArea.home;
var changes = 0;
var agencyLink = document.getElementById("nav_agency"),
    collectionLink = document.getElementById("nav_collection");

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
        agencyLink.className = (activeLink === SiteArea.agency) ?
            "link--active" : "link";
        changes ^= SiteArea.agency_mask;
    }
    if (changes & SiteArea.collection_mask) {
        collectionLink.className = (activeLink === SiteArea.collection) ?
            "link--active" : "link";
        changes ^= SiteArea.collection_mask;
    }
    return true;
}