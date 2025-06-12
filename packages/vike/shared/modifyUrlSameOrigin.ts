export { modifyUrlSameOrigin }
export { ModifyUrlSameOriginOptions }

import {
  createUrlFromComponents,
  isNotNullish_keyVal,
  parseUrl,
  objectFilter,
  assertUsageUrlPathnameAbsolute,
} from './utils.js'

type ModifyUrlSameOriginOptions = {
  hash?: string | null
  search?: Search | null
  pathname?: string
}
type Search = Record<string, string | null> | URLSearchParams

function modifyUrlSameOrigin(url: string, modify: ModifyUrlSameOriginOptions): string {
  const urlParsed = parseUrl(url, '/')

  // Pathname
  const pathname = modify.pathname ?? urlParsed.pathnameOriginal
  assertUsageUrlPathnameAbsolute(pathname, 'modify.pathname')

  // Search
  let search =
    modify.search === null ? '' : !modify.search ? urlParsed.searchOriginal : resolveSearch(urlParsed, modify.search)
  if (search === '?') search = ''

  // Hash
  let hash: string
  if (modify.hash === null) {
    hash = ''
  } else if (modify.hash === undefined) {
    hash = urlParsed.hashOriginal ?? ''
  } else {
    hash = modify.hash
    if (!hash.startsWith('#')) hash = '#' + hash
  }

  const urlModified = createUrlFromComponents(urlParsed.origin, pathname, search, hash)
  return urlModified
}

function resolveSearch(urlParsed: ReturnType<typeof parseUrl>, search: Search): string {
  let searchParams: URLSearchParams
  if (search instanceof URLSearchParams) {
    // Overwrite
    searchParams = search
  } else {
    // Merge
    const searchMap = objectFilter({ ...urlParsed.search, ...search }, isNotNullish_keyVal<string>)
    searchParams = new URLSearchParams(searchMap)
  }
  return '?' + searchParams.toString()
}
