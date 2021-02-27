export interface IOwned {
  owner?: string
  access?: string
}

export function is_accessible<T extends IOwned>(
  e: T,
  show_unlisted: boolean,
  username?: String
) {
  return (
    e.owner == undefined ||
    e.owner === username ||
    e.access == "public" ||
    (show_unlisted && e.access == "unlisted")
  )
}

export function filter_accessible<T extends IOwned>(
  items: T[],
  show_unlisted: boolean,
  username?: String
) {
  return items.filter((e) => is_accessible(e, show_unlisted, username))
}
