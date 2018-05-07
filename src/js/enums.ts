export const enum SiteArea {
    home,
    agency,
    collection,

    home_mask = 1 << home,
    agency_mask = 1 << agency,
    collection_mask = 1 << collection
}

export const enum ClickAction {
    home,
    agency,
    collection,
    contact
}

export const enum ChangeHandler {
    contact,
    nav,
    section,

    contact_mask = 1 << contact,
    nav_mask = 1 << nav,
    section_mask = 1 << section,

    nav_section_mask = nav_mask | section_mask,
}

export const enum ListenerEvent {
    resize,
    scroll,

    resize_mask = 1 << resize,
    scroll_mask = 1 << scroll
}

export const enum SectionChange {
    scroll,
    resize,
    navigate,

    scroll_mask = 1 << scroll,
    resize_mask = 1 << resize,
    navigate_mask = 1 << navigate,

    transition_ms = 450,
}