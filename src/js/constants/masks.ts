export const enum ChangeHandler {
    _slides,
    _lift,
    _page,
    _contact,
    _product,
    _resize,

    slides = 1 << _slides,
    lift = 1 << _lift,
    page = 1 << _page,
    contact = 1 << _contact,
    product = 1 << _product,
    resize = 1 << _resize,

    navigate = page | slides,
    liftedContent = lift | contact | product,
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
    _turning,
    _data,
    _info,
    _gallery,
    _filter,
    _order,
    _share,
    _mount,

    group1 = (1 << 4) - 1,
    turning = 1 << _turning,
    data = 1 << _data,
    info = 1 << _info,
    gallery = 1 << _gallery,

    group2 = group1 << 4,
    filter = 1 << _filter,
    order = 1 << _order,
    share = 1 << _share,
    mount = 1 << _mount,
}
