const contactEl = document.getElementById("contact");
var visible = false;

export function toggleContact () {
    visible = !visible;
    requestAnimationFrame(updateContact);
}

function updateContact () {
    contactEl.style.bottom = visible ? "0" : "-100%";
}