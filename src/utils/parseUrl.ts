import { assert } from '../utils'

export { parseUrl }

function parseUrl(url: string): { origin: string; pathname: string; search: string; hash: string } {
  let { origin, pathname, search, hash } = robustParse(url)
  if (hash === '' && url.includes('#')) {
    assert(url.endsWith('#'))
    hash = '#'
  }
  assert(pathname.startsWith('/'))
  assert(hash === '' || hash.startsWith('#'))
  assert(url === `${origin}${pathname}${search}${hash}`)
  return { origin, pathname, search, hash }
}

function robustParse(url: string) {
  try {
    const { origin, pathname, search, hash } = new URL(url)
    return { origin, pathname, search, hash }
  } catch (err) {
    assert(url.startsWith('/'))
    const { pathname, search, hash } = new URL('https://fake-origin.example.org' + url)
    return { origin: '', pathname, search, hash }
  }
}
