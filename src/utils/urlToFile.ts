import { assert } from '../utils'
import { slice } from '../utils'
const pagePropsSuffix = '/index.pageProps.json'

export { urlToFile }
export { isPagePropsUrl }
export { retrieveOriginalUrl }

/**
 URL `/ -> `/index`
 URL `/about` -> `/about/index`
 URL `/about/` -> `/about/index`
 URL `/news/hello` -> `/news/hello/index`
 ...
*/
function urlToFile(url: string): string {
  assert(url.startsWith('/'))
  return `${url}${url.endsWith('/') || url === '/' ? '' : '/'}index`
}

function isPagePropsUrl(url: string): boolean {
  return url.endsWith(pagePropsSuffix)
}
function retrieveOriginalUrl(url: string): string {
  assert(isPagePropsUrl(url))
  url = slice(url, 0, -1 * pagePropsSuffix.length)
  if (url === '') url = '/'
  return url
}
