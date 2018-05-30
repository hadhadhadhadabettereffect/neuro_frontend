export const enum SiteArea {
    home,
    agency,
    collection,

    home_mask = 1 << home,
    agency_mask = 1 << agency,
    collection_mask = 1 << collection,
}

export const enum ChangeHandler {
    _slides,
    _navigation,
    _content,
    _popunder,
    _resize,

    slides = 1 << _slides,
    navigation = 1 << _navigation,
    content = 1 << _content,
    popunder = 1 << _popunder,
    resize = 1 << _resize,

    page = navigation | content | slides,
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
