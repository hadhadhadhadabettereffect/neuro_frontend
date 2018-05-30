import { NavMeasure } from "../constants/options";
import { SiteArea } from "../constants/masks";


const pageTitles = [
    "Neuro Studio", "Neuro Studio | Agency", "Neuro Studio | Collection"
];
const pageUrls = process.env.NODE_ENV === "production" ?
    ["/", "/agency", "/collection"] : ["/","/","/"];
const agencyLinks = <any>document.getElementById("subnav--agency").querySelectorAll(".subnav__item"),
    collectionLinks = <any>document.getElementById("subnav--collection").querySelectorAll(".subnav__item");
var activeLink = SiteArea.home;
var changes = 0;

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
            agencyLinks[2].className = "nav__link--side nav__link--active";
        } else {
            agencyLinks[2].className = "nav__link--side";
        }
    }
    if (changes & SiteArea.collection_mask) {
        changes ^= SiteArea.collection_mask;
        if (activeLink === SiteArea.collection) {
            collectionLinks[2].className = "nav__link--side nav__link--active";
        } else {
            collectionLinks[2].className = "nav__link--side";
        }
    }

    history.pushState({
        page: activeLink
    }, pageTitles[activeLink], pageUrls[activeLink]);

    return true;
}