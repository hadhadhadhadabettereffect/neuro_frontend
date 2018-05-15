export const enum SiteArea {
    home,
    agency,
    collection,

    home_mask = 1 << home,
    agency_mask = 1 << agency,
    collection_mask = 1 << collection,
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

    agency_nav_offset = agency_about,
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
    slide,
    subnav,
    endscroll,

    scroll_mask = 1 << scroll,
    resize_mask = 1 << resize,
    navigate_mask = 1 << navigate,
    slide_mask = 1 << slide,
    subnav_mask = 1 << subnav,
    endscroll_mask = 1 << endscroll,

    not_scroll_slide = ~(scroll_mask | slide_mask),
    slide_and_subnav = slide_mask | subnav_mask,
    nav_and_subnav = navigate_mask | subnav_mask,

    transition_ms = 450,
}

export const enum NavMeasure {
    nav_height = 75,
    link_width = 100,
    sublink_width = 90,

    sublink_start = sublink_width / -2,
    link_a = (link_width / 2) + sublink_width - sublink_start,
    link_b = (link_width / 2) - sublink_start,
    link_c = -(link_width / 2) - sublink_width - sublink_start,
    link_d = link_c - sublink_width,

    // top nav height + btm nav height
    top_btm_space = nav_height * 2 + 2,

    min_height = top_btm_space +
        link_width + // side nav link
        sublink_width * 4, // 4 subnav items


    min_width = 500 // if < min_width, use mobile nav
}