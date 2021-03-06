export const enum TransitionMS {
    slide = 250,
    landing = 300,
    lift = 200,

    lift_divide = lift / 100,
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

export const enum SectionCount {
    a0 = 1,
    a1 = 1,
    a2 = 3,
    a3 = 1,

    c0 = 2,
    c1 = 1,
    c2 = 1,
    c3 = 1,
}