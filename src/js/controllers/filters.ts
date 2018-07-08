import { ProductType } from "../constants/groups";


const productTypes = [1,4,2,5,2,2,2,3,3];
const productCount = productTypes.length;

var nextActive = ProductType.any;
var activeFilter = ProductType.any;
var updateIndex = 0;
var filters, products;

export function clickFilter(filter: number): boolean {
    console.log(filter);
    if (nextActive === filter) return false;
    if (!filters) {
        filters = document.querySelectorAll(".filter, .filter--active");
        products = document.querySelectorAll(".grid__item");
    }
    updateIndex = 0;
    nextActive = filter;
    return true;
}

export function updateFilters(): boolean {
    var startTime = performance.now();
    filters[activeFilter].className = "filter";
    filters[nextActive].className = "filter--active";
    activeFilter = nextActive;
    while (updateIndex < productCount) {
        products[updateIndex].style.display =
            (activeFilter === 0 || productTypes[updateIndex] === activeFilter) ?
                "block" : "none";
        ++updateIndex;
        if (performance.now() - startTime > 3) break;
    }
    return updateIndex === productCount;
}
