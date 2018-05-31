var productData;
var req = new XMLHttpRequest();
req.onreadystatechange = function () {
    if (req.readyState === XMLHttpRequest.DONE) {
        productData = JSON.parse(req.responseText);
    }
};
req.open("GET", "/data/products.json", true);
req.send();

export function showDetails(product: number) {

}
