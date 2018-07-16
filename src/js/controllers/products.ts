import { DetailsUpdate } from "../constants/masks";
import { ProductInfo,
        ProductType,
        NavDirection,
        SocialMedia } from "../constants/groups";

// social media apis
declare var PinUtils;
declare var FB;

declare const enum GalleryConfig {
    pxPerFrame = 2,
    totalFrames = 32,
    maxFrame = totalFrames - 1,
    startingFrame = 0,
    width = 625,
    height = 1600,
    doubleWidth = 1250,
}


const productsUrlBase = "//localhost:8000/products/";
const pinterestBase = "https://www.pinterest.com/pin/create/button/?url=" + productsUrlBase;
const pinterestMediaBase = "http://localhost:8000/media/products/p";

var shareBtnsVisible = false,
    orderBtnClicked = false,
    attached = false;
var updates = 0,
    activeGalleryImg = 0,
    clickedGalleryThumb = 0,
    activeInfo = 0,
    currentProduct = -1;

var x0 = 0,
    x1 = 0,
    startingFrame = GalleryConfig.startingFrame,
    currentFrame = GalleryConfig.startingFrame,
    targetFrame = GalleryConfig.startingFrame,
    trueFrame = GalleryConfig.startingFrame;

const liftEl = document.getElementById("lift__content"),
    detailsWrap = document.getElementById("product__details") as HTMLElement,
    productName = detailsWrap.querySelector("#product__name") as HTMLElement,
    turnerImg = detailsWrap.querySelector("#turner__img") as HTMLImageElement,
    productInfo = detailsWrap.querySelector("#product__info") as HTMLElement,
    orderBtn = detailsWrap.querySelector("#product__order") as HTMLElement,
    shareBtns = detailsWrap.querySelector("#share-buttons") as HTMLElement,
    galleryMain = detailsWrap.querySelector("#gallery__main") as HTMLImageElement,
    galleryThumbs = detailsWrap.querySelectorAll(".gallery__thumb") as NodeListOf<HTMLImageElement>,
    toggleDescription = detailsWrap.querySelector("#product__description") as HTMLElement,
    toggleMaterials = detailsWrap.querySelector("#product__materials") as HTMLElement;
const filters = document.querySelectorAll(".filter, .filter--active") as NodeListOf<HTMLElement>,
    products = document.querySelectorAll(".grid__item--thumb") as NodeListOf<HTMLImageElement>;

var nextActive = ProductType.any;
var activeFilter = ProductType.any;
var updateIndex = 0;
var productCount = 0;
var productData;

detailsWrap.remove();

void function init() {
    const reqData = new XMLHttpRequest();
    reqData.onreadystatechange = function () {
        if (reqData.readyState === XMLHttpRequest.DONE) {
            productData = JSON.parse(reqData.responseText);
            productCount = productData.length;
        }
    };
    reqData.open("GET", "/products/data.json", true);
    reqData.send();
    // init social buttons
    let scriptTag = document.createElement("script");
    scriptTag.type = "text/javascript";
    scriptTag.async = true;
    scriptTag.src = "//assets.pinterest.com/js/pinit.js";
    document.head.appendChild(scriptTag);
    scriptTag = document.createElement("script");
    scriptTag.type = "text/javascript";
    scriptTag.async = true;
    scriptTag.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.6&appId=432524660561276";
    document.head.appendChild(scriptTag);
    scriptTag = null;
}();


export function attachDetails(attach: boolean) {
    if (attached !== attach) {
        attached = attach;
        updates |= DetailsUpdate.mount;
    }
}

export function startTurner(event: MouseEvent) {
    if ((updates & DetailsUpdate.turning) === 0) {
        window.addEventListener("mousemove", handleMouseMove, false);
        window.addEventListener("mouseup", handleMouseUp, false);
        updates |= DetailsUpdate.turning;
        x0 = event.clientX;
    }
}

export function showDetails(productIndex: number) {
    if (!attached) {
        attached = true;
        updates |= DetailsUpdate.mount;
    }
    if (currentProduct !== productIndex) {
        currentProduct = productIndex;
        updates |= DetailsUpdate.data;
    }
}

export function nextProduct(direction: number) {
    if (direction === NavDirection.prev) {
        if (--currentProduct < 0) currentProduct = productData.length - 1;
    } else if (++currentProduct >= productData.length) {
        currentProduct = 0;
    }
      updates |= DetailsUpdate.data;
}

export function clickDetailThumb(index: number): boolean {
    if (index === activeGalleryImg) return false;
    clickedGalleryThumb = index;
    updates |= DetailsUpdate.gallery;
    return true;
}

export function toggleProductInfo(showInfo: number): boolean {
    if (activeInfo === showInfo) return false;
    activeInfo = showInfo;
    updates |= DetailsUpdate.info;
    return true;
}

export function clickOrderProduct(): boolean {
    if (orderBtnClicked) return false;
    orderBtnClicked = true;
    updates |= DetailsUpdate.order;
    return true;
}

export function clickShare(socialmedium: number): boolean {
    switch (socialmedium) {
        case SocialMedia.none:
            shareBtnsVisible = !shareBtnsVisible;
            updates |= DetailsUpdate.share;
            return true;

        case SocialMedia.pinterest:
            PinUtils.pinOne({
                url: pinterestBase + currentProduct,
                media: pinterestMediaBase + currentProduct + "_main.jpg",
                description: productData[currentProduct].description
            });
            break;

        case SocialMedia.facebook:
            FB.ui({
                method: "share",
                href: productsUrlBase + currentProduct,
                quote: productData[currentProduct].description
            }, function (response) {
                console.log(response);
            });
            break;

        case SocialMedia.twitter:
            break;
    }
    return false;
}


export function clickFilter(filter: number): boolean {
    console.log(filter);
    if (nextActive === filter) return false;
    updateIndex = 0;
    nextActive = filter;
    return true;
}


export function updateProductDetails(): boolean {
    const start = performance.now();
    if (updates & DetailsUpdate.group1) {
        if (updates & DetailsUpdate.turning) {
            turnTurner();
        }
        if (updates & DetailsUpdate.data) {
            setProductDetails();
            updates ^= DetailsUpdate.data;
        }
        if (updates & DetailsUpdate.info) {
            setInfoText();
            updates ^= DetailsUpdate.info;
        }
        if (updates & DetailsUpdate.gallery) {
            updateGallery();
            updates ^= DetailsUpdate.gallery;
        }
    }
    if (updates & DetailsUpdate.group2) {
        if (updates & DetailsUpdate.filter) {
            if (updateFilters(start)) {
                updates ^= DetailsUpdate.filter;
            } else {
                return false;
            }
        }
        if (updates & DetailsUpdate.order) {
            updateOrderBtn();
            updates ^= DetailsUpdate.order;
        }
        if (updates & DetailsUpdate.share) {
            updateShareBtns();
            updates ^= DetailsUpdate.share;
        }
        if (updates & DetailsUpdate.mount) {
            if (attached) liftEl.appendChild(detailsWrap);
            else detailsWrap.remove();
            updates ^= DetailsUpdate.mount;
        }
    }
    return updates === 0;
}

function updateFilters(startTime): boolean {
    filters[activeFilter].className = "filter";
    filters[nextActive].className = "filter--active";
    activeFilter = nextActive;
    while (updateIndex < productData.length) {
        products[updateIndex].style.display =
            (activeFilter === 0 || productData[updateIndex].type === activeFilter) ?
                "block" : "none";
        ++updateIndex;
        if (performance.now() - startTime > 3) break;
    }
    return updateIndex === productData.length;
}

function setProductDetails() {
    const data = productData[currentProduct];
    productName.innerText = data.name;
    productInfo.innerText = activeInfo === ProductInfo.description ?
        data.description : data.materials;
    turnerImg.src = "/static/products/360/" + productData[currentProduct].id + ".jpg";
    if (shareBtnsVisible) {
        shareBtnsVisible = false;
        updateShareBtns();
    }
    if (orderBtnClicked) {
        orderBtnClicked = false;
        updateOrderBtn();
    }
    setGallery();
}

function setInfoText() {
    if (activeInfo === ProductInfo.description) {
        productInfo.innerText = productData[currentProduct].description;
        toggleDescription.className = "action action--active";
        toggleMaterials.className = "action";
    } else {
        productInfo.innerText = productData[currentProduct].materials;
        toggleDescription.className = "action";
        toggleMaterials.className = "action action--active";
    }
}

function updateOrderBtn() {
    if (orderBtnClicked) {
        orderBtn.innerText = "capacity reached";
        orderBtn.className = "msg";
    } else {
        orderBtn.innerText = "order";
        orderBtn.className = "button";
    }
}

function setGallery() {
    const baseUrl = "/media/photos/" + productData[currentProduct].id;

    galleryMain.src = baseUrl + "_1.jpg";
    galleryThumbs[0].src = baseUrl + "_1.jpg";
    galleryThumbs[1].src = baseUrl + "_2.jpg";
    galleryThumbs[2].src = baseUrl + "_3.jpg";
    galleryThumbs[3].src = baseUrl + "_4.jpg";

    if (activeGalleryImg !== 0) {
        galleryThumbs[activeGalleryImg].className = "gallery__thumb";
        galleryThumbs[0].className = "gallery__thumb gallery__thumb--active";
        activeGalleryImg = 0;
    }
}

function updateGallery() {
    galleryThumbs[activeGalleryImg].className = "gallery__thumb";
    galleryThumbs[clickedGalleryThumb].className = "gallery__thumb gallery__thumb--active";
    galleryMain.src = galleryThumbs[clickedGalleryThumb].src;
    activeGalleryImg = clickedGalleryThumb;
}

function updateShareBtns() {
    shareBtns.style.visibility = shareBtnsVisible ? "visible" : "hidden";
}


function turnTurner() {
    targetFrame = startingFrame + Math.round((x0 - x1) / GalleryConfig.doubleWidth * GalleryConfig.totalFrames);

    if (targetFrame > currentFrame) {
        ++currentFrame;
        if (++trueFrame > GalleryConfig.maxFrame)
            trueFrame = 0;
    } else if (targetFrame < currentFrame) {
        --currentFrame;
        if (--trueFrame < 0) trueFrame = GalleryConfig.maxFrame;
    }
    turnerImg.style.left = "-" + trueFrame + "00%";
}


// mouse listeners

function handleMouseMove(event) {
    x1 = event.clientX;
}

function handleMouseUp(event) {
    if (updates & DetailsUpdate.turning) {
        window.removeEventListener("mousemove", handleMouseMove, false);
        window.removeEventListener("mouseup", handleMouseUp, false);
        updates ^= DetailsUpdate.turning;
        startingFrame = trueFrame;
        currentFrame = trueFrame;
    }
}