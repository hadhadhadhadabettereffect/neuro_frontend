import { SiteArea } from "./enums";
import { setContentHTML } from "./sections";
import { setContactHTML } from "./contact";
import "./listeners";

// fetch agency and collection html
var fetchAgency = new XMLHttpRequest();
fetchAgency.onreadystatechange = function () {
    if (fetchAgency.readyState === XMLHttpRequest.DONE) {
        setContentHTML(SiteArea.agency_mask, fetchAgency.responseText);
    }
};
fetchAgency.open("GET", "/agency.html", true);
fetchAgency.send();

var fetchCollection = new XMLHttpRequest();
fetchCollection.onreadystatechange = function () {
    if (fetchCollection.readyState === XMLHttpRequest.DONE) {
        setContentHTML(SiteArea.collection_mask, fetchCollection.responseText);
    }
};
fetchCollection.open("GET", "/collection.html", true);
fetchCollection.send();

var fetchContact = new XMLHttpRequest();
fetchContact.onreadystatechange = function () {
    if (fetchAgency.readyState === XMLHttpRequest.DONE) {
        setContactHTML(fetchContact.responseText);
    }
};
fetchContact.open("GET", "/contact.html", true);
fetchContact.send();