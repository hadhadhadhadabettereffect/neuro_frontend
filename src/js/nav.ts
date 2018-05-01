import { NavLink } from "./enums";

var activeLink = NavLink.home;
var changes = 0;

export function clickNavLink (link: number) : void {
    if (activeLink !== link) {
        changes |= ((1<<link)|(1<<activeLink));
        activeLink = link;
    }
}