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
    contact,

    agency_about,
    agency_services,
    agency_work,
    agency_team,
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

export const enum NavMeasure {
    nav_height = 75,
    link_width = 150,
    sublink_width = 100,

    sublink_start = sublink_width / -2,
    link_a = (link_width / 2) + sublink_width - sublink_start,
    link_b = (link_width / 2) - sublink_start,
    link_c = -(link_width / 2) - sublink_width - sublink_start,
    link_d = link_c - sublink_width,

    min_height = nav_height + // top nav
        nav_height + // bottom nav
        link_width + // side nav link
        sublink_width * 4 // 4 subnav items

}