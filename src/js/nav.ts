import { NavLink } from "./enums";

var activeLink = NavLink.home;
var changes = 0;
var agencyLink = document.getElementById("nav_agency"),
    collectionLink = document.getElementById("nav_collection");

export function clickNavLink (link: number) : void {
    if (activeLink !== link) {
        changes |= ((1<<link)|(1<<activeLink));
        activeLink = link;
        requestAnimationFrame(updateNav);
    }
}

function updateNav () {
    if (changes & NavLink.home_mask) changes ^= NavLink.home;
    if (changes & NavLink.agency_mask) {
        agencyLink.className = (activeLink === NavLink.agency) ?
            "active" : "";
        changes ^= NavLink.agency;
    }
    if (changes & NavLink.collection_mask) {
        collectionLink.className = (activeLink === NavLink.collection) ?
            "active" : "";
        changes ^= NavLink.collection;
    }
}