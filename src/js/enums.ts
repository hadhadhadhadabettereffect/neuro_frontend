export const enum NavLink {
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