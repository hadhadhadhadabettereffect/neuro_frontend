export const enum SiteArea {
    agency,
    collection,
    home,

    agency_mask = 1 << agency,
    collection_mask = 1 << collection,
    home_mask = 1 << home,
}

export const enum ChangeHandler {
    _slides,
    _page,
    _contact,
    _resize,

    slides = 1 << _slides,
    page = 1 << _page,
    contact = 1 << _contact,
    resize = 1 << _resize,

    navigate = page | slides,
}

export const enum ListenerEvent {
    resize,
    scroll,

    resize_mask = 1 << resize,
    scroll_mask = 1 << scroll
}

export const enum ContentChange {
    _scroll,
    _postscroll,
    _jump,
    _subnav,

    scroll = 1 << _scroll,
    postscroll = 1 << _postscroll,
    jump = 1 << _jump,
    subnav = 1 << _subnav,

    jump_and_subnav = jump | subnav,
    not_jump_subnav = ~jump_and_subnav,
}