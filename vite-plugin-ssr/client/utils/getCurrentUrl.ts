export { getCurrentUrl }

import { parseUrl } from '../../utils/parseUrl'
import { assert } from '../../utils/assert'

function getCurrentUrl(options?: { withoutHash: true }): string {
  const url = window.location.href
  const { origin, searchOriginal, hashOriginal, pathnameOriginal } = parseUrl(url, '/')
  let urlCurrent: string
  if (options?.withoutHash) {
    urlCurrent = `${pathnameOriginal}${searchOriginal || ''}`
    const urlRecreated = `${origin || ''}${urlCurrent}${hashOriginal || ''}`
    assert(url === urlRecreated, { url, urlRecreated })
  } else {
    urlCurrent = `${pathnameOriginal}${searchOriginal || ''}${hashOriginal || ''}`
    const urlRecreated = `${origin || ''}${urlCurrent}`
    assert(url === urlRecreated, { url, urlRecreated })
  }
  return urlCurrent
}
