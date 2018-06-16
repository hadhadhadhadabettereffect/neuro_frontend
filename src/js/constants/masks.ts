export const enum ChangeHandler {
    _slides,
    _page,
    _product,
    _contact,
    _resize,
    _filters,

    slides = 1 << _slides,
    page = 1 << _page,
    product = 1 << _product,
    contact = 1 << _contact,
    resize = 1 << _resize,
    filters = 1 << _filters,

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

export const enum DetailsUpdate {
    _active,
    _data,
    _gallery,
    _info,
    _order,

    active = 1 << _active,
    data = 1 << _data,
    gallery = 1 << _gallery,
    info = 1 << _info,
    order = 1 << _order,
}
