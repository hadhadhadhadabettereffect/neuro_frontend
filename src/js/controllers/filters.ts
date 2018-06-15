import { ProductType } from "../constants/groups";

var nextActive = ProductType.any;
var activeFilter = ProductType.any;
var filters;

export function clickFilter(filter: number): boolean {
    if (nextActive === filter) return false;
    if (!filters) filters = document.querySelectorAll(".filter, .filter--active");
    nextActive = filter;
    return true;
}

export function updateFilters(): boolean {
    filters[activeFilter].className = "filter";
    filters[nextActive].className = "filter--active";
    activeFilter = nextActive;
    return true;
}
