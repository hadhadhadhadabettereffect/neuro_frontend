import { DetailsUpdate } from "../constants/masks";


var active = false;
var updates = 0,
    activeGalleryImg = 0,
    clickedGalleryThumb = 0,
    currentProduct = -1;
var productData,
    detailsWrap,
    productImage,
    productName,
    productDescription,
    productMaterials,
    galleryMain,
    galleryThumbs;

void function init() {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === XMLHttpRequest.DONE) {
            productData = JSON.parse(req.responseText);
        }
    };
    req.open("GET", "/data/products.json", true);
    req.send();

    detailsWrap = document.createElement("div");
    detailsWrap.id = "details";

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
    return updates === 0;
}

function setProductDetails() {
    var data = productData[currentProduct],
        baseUrl = "/media/products/p" + data.id;
    productName.innerText = data.name;
    productDescription.innerText = data.description;
    productMaterials.innerHtml = data.materials;
    productImage.src = baseUrl + "_main.jpg";
}

function setGallery() {
    const baseUrl = "/media/products/p" + productData[currentProduct].id;

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
    detailsWrap.display = active ? "block" : "none";
}