import { ChangeHandler } from "./enums";
import { updateNav } from "./nav";
import { updateSections } from "./sections";
import { updateContact } from "./contact";

var changes = 0;

export function markChange(changeMask: number) {
    changes |= changeMask;
}

function animate() {
    requestAnimationFrame(animate);
    applyUpdates();
}

function applyUpdates() {
    if (changes) {
        // only applying changes to one handler at a time
        // in the order: contact, sections, nav
        // so if contact is active, nav and sections wont change
        if (changes & ChangeHandler.contact_mask) {
            if (updateContact())
                changes ^= ChangeHandler.contact_mask;
        }
        else if (changes & ChangeHandler.section_mask) {
            if (updateSections())
                changes ^= ChangeHandler.section_mask;
        }
         else if (changes & ChangeHandler.nav_mask) {
            if (updateNav())
                changes ^= ChangeHandler.nav_mask;
        }
    }
}

requestAnimationFrame(animate);