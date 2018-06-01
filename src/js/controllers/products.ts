import { DetailsUpdate } from "../constants/masks";
import { ProductInfo } from "../constants/groups";

var active = false;
var updates = 0,
    activeGalleryImg = 0,
    clickedGalleryThumb = 0,
    activeInfo = 0,
    currentProduct = -1;
var productData,
    detailsWrap,
    productImage,
    productName,
    productInfo,
    galleryMain,
    galleryThumbs,
    toggleDescription,
    toggleMaterials;

void function init() {
    detailsWrap = document.createElement("div");
    detailsWrap.id = "details";

    const reqData = new XMLHttpRequest();
    reqData.onreadystatechange = function () {
        if (reqData.readyState === XMLHttpRequest.DONE) {
            productData = JSON.parse(reqData.responseText);
        }
    };
    reqData.open("GET", "/data/products.json", true);
    reqData.send();

    const reqHtml = new XMLHttpRequest();
    reqHtml.onreadystatechange = function () {
        if (reqHtml.readyState === XMLHttpRequest.DONE) {
            detailsWrap.innerHtml = reqHtml.responseText;
            productName = detailsWrap.querySelector("#product__name");
            productImage = detailsWrap.querySelector("#product__image");
            productInfo = detailsWrap.querySelector("#product__info");
            galleryMain = detailsWrap.querySelector("#gallery__main");
            galleryThumbs = detailsWrap.querySelectorAll(".gallery__item");
            let toggles = detailsWrap.querySelectorAll(".toggle");
            toggleDescription = toggles[0];
            toggleMaterials = toggles[1];
            toggles = null;
        }
    };
}();

export function showDetails(productIndex: number) {
    if (!active) {
        active = true;
        updates |= DetailsUpdate.active;
    }
    if (currentProduct !== productIndex) {
        currentProduct = productIndex;
        updates |= DetailsUpdate.data;
    }
}

export function clickDetailThumb(index: number): boolean {
    if (index === activeGalleryImg) return false;
    clickedGalleryThumb = index;
    return true;
}

export function toggleProductInfo(showInfo: number): boolean {
    if (activeInfo === showInfo) return false;
    activeInfo = showInfo;
    updates |= DetailsUpdate.info;
    return true;
}

export function updateProductDetails(): boolean {
    if (updates & DetailsUpdate.active) {
        updateVisible();
        updates ^= DetailsUpdate.active;
    }
    if (updates & DetailsUpdate.data) {
        updateProductDetails();
        updates ^= DetailsUpdate.data;
    }
    if (updates & DetailsUpdate.gallery) {
        updateGallery();
        updates ^= DetailsUpdate.gallery;
    }
    if (updates & DetailsUpdate.info) {
        updates ^= DetailsUpdate.info;
    }
    return updates === 0;
}

function setProductDetails() {
    const data = productData[currentProduct];
    productName.innerText = data.name;
    productInfo.innerHtml = activeInfo === ProductInfo.description ?
        data.description : data.materials;
    productImage.src = "/media/products/p" + 0 /* debug data.id */ + "_main.jpg";
}

function setInfoText() {
    if (activeInfo === ProductInfo.description) {
        productInfo.innerHtml = productData[currentProduct].description;
        toggleDescription.className = "toggle toggle--active";
        toggleMaterials.className = "toggle";
    } else {
        productInfo.innerHtml = productData[currentProduct].materials;
        toggleDescription.className = "toggle";
        toggleMaterials.className = "toggle toggle--active";
    }
}

function setGallery() {
    const baseUrl = "/media/products/p" + 0; // debug productData[currentProduct].id;

    galleryMain.src = baseUrl + "_0.jpg";
    galleryThumbs[0].src = baseUrl + "_0.jpg";
    galleryThumbs[1].src = baseUrl + "_1.jpg";
    galleryThumbs[2].src = baseUrl + "_2.jpg";
    galleryThumbs[3].src = baseUrl + "_3.jpg";

    if (activeGalleryImg !== 0) {
        galleryThumbs[activeGalleryImg].className = "gallery__thumb";
        galleryThumbs[0].className = "gallery__thumb--active";
        activeGalleryImg = 0;
    }
}

function updateGallery() {
    galleryThumbs[activeGalleryImg].className = "gallery__thumb";
    galleryThumbs[clickedGalleryThumb].className = "gallery__thumb--active";
    galleryMain.src = galleryThumbs[clickedGalleryThumb].src;
    activeGalleryImg = clickedGalleryThumb;
}

function updateVisible() {
    if (detailsWrap.parentNode) detailsWrap.parentNode.removeChild(detailsWrap);
    if (active) document.body.appendChild(detailsWrap);
}
