export { normalizeUrlPathname }

import { assert, parseUrl } from '../utils.js'

function normalizeUrlPathname(urlOriginal: string): string | null {
  const urlParsed = parseUrl(urlOriginal, '/')
  const { pathnameOriginal } = urlParsed
  assert(pathnameOriginal.startsWith('/'))
  const pathnameNormalized = '/' + pathnameOriginal.split('/').filter(Boolean).join('/')
  if (pathnameOriginal === pathnameNormalized) return null
  assert(urlOriginal === `${urlParsed.origin || ''}${recreateUrl(pathnameOriginal, urlParsed)}`)
  const urlNormalized = recreateUrl(pathnameNormalized, urlParsed)
  return urlNormalized
}

// Copied & adapted from https://github.com/brillout/vite-plugin-ssr/blob/bdfa8acd68a3575bfa1c8a4a3821ffc02da55ade/vite-plugin-ssr/utils/parseUrl.ts#L85-L86
function recreateUrl(pathname: string, urlParsed: ReturnType<typeof parseUrl>) {
  const urlRecreated = `${pathname}${urlParsed.searchOriginal || ''}${urlParsed.hashOriginal || ''}`
  return urlRecreated
}
