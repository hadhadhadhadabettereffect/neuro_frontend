
declare const enum PaginationUpdate {
    _page,

    page = 1 << _page,
}

declare const enum PageType {
    text,
    slider,
}

var updates = 0;
var pageCount = 5;
var currentPage = 0;
var nextPage = 0;
var pageType = 0;
var pageTypes;
var pageData;
var pageNumbers, contentWrap;
var pageWraps = [document.createElement("div"), document.createElement("div")];

var textPage_title = document.createElement("h3");
var textPage_text = document.createElement("div");
var textPage_img = document.createElement("img");

var slider_top = document.createElement("img");
var slider_btm = document.createElement("img");


pageWraps[PageType.text].appendChild(textPage_title);
pageWraps[PageType.text].appendChild(textPage_text);
pageWraps[PageType.text].appendChild(textPage_img);
pageWraps[PageType.slider].appendChild(slider_top);
pageWraps[PageType.slider].appendChild(slider_btm);

void function init() {
    pageTypes = [0,1,1,1,1,0];
    pageData = [
        ["title", "text", "image"],
        ["image_a", "image_b"],
    ];
}();


export function clickPageLink(page: number): boolean {
    if (page === nextPage) return false;
    nextPage = page;
    updates |= PaginationUpdate.page;
    return true;
}

export function updatePagination() {
    if (updates & PaginationUpdate.page) {
        setPageContent();
        updates ^= PaginationUpdate.page;
    }
}


function setPageContent() {
    pageNumbers[currentPage].className = "pagination__number";
    pageNumbers[nextPage].className = "pagination__number--active";
    currentPage = nextPage;
    if (pageType !== pageTypes[currentPage]) {
        pageWraps[pageType].remove();
        pageType = pageTypes[currentPage];
        contentWrap.appendChild(pageWraps[currentPage]);
    }
    if (pageType === PageType.text) {
        textPage_title.innerText = pageData[currentPage][0];
        textPage_text.innerText = pageData[currentPage][1];
        textPage_img.src = pageData[currentPage][2];
    } else {
        slider_top.src = pageData[currentPage][0];
        slider_btm.src = pageData[currentPage][1];
        // RESET SLIDER TO .5
    }
}