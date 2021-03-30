import { assert } from '../utils'

export { parseUrl }

function parseUrl(
  url: string
): { pathname: string; search: string; hash: string } {
  try {
    const { pathname, search, hash } = new URL(url)
    return { pathname, search, hash }
  } catch (err) {
    assert(url.startsWith('/'))
    const { pathname, search, hash } = new URL(
      'https://fake-origin.example.org' + url
    )
    return { pathname, search, hash }
  }
}
