export { getCurrentUrl }

import { parseUrl } from './parseUrl.mjs'
import { assert } from './assert.mjs'

function getCurrentUrl(options?: { withoutHash: true }): string {
  const url = window.location.href
  const { searchOriginal, hashOriginal, pathname } = parseUrl(url, '/')
  let urlCurrent: string
  if (options?.withoutHash) {
    urlCurrent = `${pathname}${searchOriginal || ''}`
  } else {
    urlCurrent = `${pathname}${searchOriginal || ''}${hashOriginal || ''}`
  }
  assert(urlCurrent.startsWith('/'))
  return urlCurrent
}
