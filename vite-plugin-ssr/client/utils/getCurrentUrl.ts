import { parseUrl } from '../../utils/parseUrl'
import { assert } from '../../utils/assert'

export { getCurrentUrl }

function getCurrentUrl(options?: { withoutHash: true }): string {
  const url = window.location.href
  const { origin, searchString, hashString, pathnameWithBaseUrl } = parseUrl(url, '/')
  let urlCurrent: string
  if (options?.withoutHash) {
    urlCurrent = `${pathnameWithBaseUrl}${searchString || ''}`
    const urlRecreated = `${origin || ''}${urlCurrent}${hashString || ''}`
    assert(url === urlRecreated, { url, urlRecreated })
  } else {
    urlCurrent = `${pathnameWithBaseUrl}${searchString || ''}${hashString || ''}`
    const urlRecreated = `${origin || ''}${urlCurrent}`
    assert(url === urlRecreated, { url, urlRecreated })
  }
  return urlCurrent
}
