import { assert, parseUrl, objectAssign, isCallable } from './utils'

export { addComputedUrlProps }
export type { PageContextUrls }
export type { PageContextUrlSource }

// Copy paste from https://vite-plugin-ssr.com/pageContext
type UrlParsed = {
  origin: null | string
  pathname: string
  pathnameWithBaseUrl: string
  pathnameWithoutBaseUrl?: never // We have renamed `pathnameWithoutBaseUrl` to `pathname` for users
  hasBaseUrl: boolean
  search: Record<string, string>
  searchString: null | string
  hash: string
  hashString: null | string
}
type PageContextUrls = { urlPathname: string; urlParsed: UrlParsed }

function addComputedUrlProps<PageContext extends Record<string, unknown> & PageContextUrlSource>(
  pageContext: PageContext,
): asserts pageContext is PageContext & PageContextUrls {
  if ('urlPathname' in pageContext) {
    assert(Object.getOwnPropertyDescriptor(pageContext, 'urlPathname')?.get === urlPathnameGetter)
    assert(Object.getOwnPropertyDescriptor(pageContext, 'urlParsed')?.get === urlParsedGetter)
  } else {
    Object.defineProperty(pageContext, 'urlPathname', {
      get: urlPathnameGetter,
      enumerable: true,
      configurable: true,
    })
    Object.defineProperty(pageContext, 'urlParsed', {
      get: urlParsedGetter,
      enumerable: true,
      configurable: true,
    })
  }
}

type PageContextUrlSource = { url: string; _baseUrl: string; _urlProcessor: null | ((url: string) => string) }
function getUrlParsed(pageContext: PageContextUrlSource) {
  let { url, _baseUrl: baseUrl, _urlProcessor: urlProcessor } = pageContext
  assert(baseUrl.startsWith('/'))
  assert(urlProcessor === null || isCallable(urlProcessor))
  if (urlProcessor !== null) {
    url = urlProcessor(url)
  }
  return parseUrl(url, baseUrl)
}
function urlPathnameGetter(this: PageContextUrlSource) {
  const { pathnameWithoutBaseUrl } = getUrlParsed(this)
  const urlPathname = pathnameWithoutBaseUrl
  assert(urlPathname.startsWith('/'))
  return urlPathname
}
function urlParsedGetter(this: PageContextUrlSource): UrlParsed {
  const urlParsedOriginal = getUrlParsed(this)
  const pathname = urlParsedOriginal.pathnameWithoutBaseUrl
  const urlParsed: Omit<typeof urlParsedOriginal, 'pathnameWithoutBaseUrl'> = urlParsedOriginal
  delete (urlParsed as Partial<typeof urlParsedOriginal>).pathnameWithoutBaseUrl
  objectAssign(urlParsed, { pathname })
  assert(urlParsed.pathname.startsWith('/'))
  assert(!('pathnameWithoutBaseUrl' in urlParsed))
  return urlParsed
}
