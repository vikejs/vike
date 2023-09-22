export { urlToFile }
export { baseServer }

import { assert } from './assert.js'
import { parseUrl } from './parseUrl.js'
import { slice } from './slice.js'

// - When doing a `.pageContext.json` HTTP request, the base URL should be preserved. (The server-side will handle the base URL.)
// - While prerendering there is no base URL
const baseServer = '/'

function urlToFile(url: string, fileExtension: '.pageContext.json' | '.html', doNotCreateExtraDirectory: boolean) {
  const { pathnameOriginal, searchOriginal, hashOriginal } = parseUrl(url, baseServer)
  if (url.startsWith('/')) {
    assert(url === `${pathnameOriginal}${searchOriginal || ''}${hashOriginal || ''}`, { url })
  }

  const hasTrailingSlash = pathnameOriginal.endsWith('/')
  let pathnameModified: string
  if (doNotCreateExtraDirectory && pathnameOriginal !== '/') {
    if (hasTrailingSlash) {
      pathnameModified = slice(pathnameOriginal, 0, -1)
    } else {
      pathnameModified = pathnameOriginal
    }
    assert(!pathnameModified.endsWith('/'), { url })
    assert(pathnameModified !== '')
  } else {
    pathnameModified = pathnameOriginal + (hasTrailingSlash ? '' : '/') + 'index'
  }
  assert(pathnameModified)

  pathnameModified = pathnameModified + fileExtension

  const fileUrl = `${pathnameModified}${searchOriginal || ''}${hashOriginal || ''}`
  return fileUrl
}
