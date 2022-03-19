import { assert, assertUsage, castProp, hasProp, normalizeBaseUrl, slice } from '../utils'
import { getSsrEnv } from '../ssrEnv'
import type { MediaType } from './inferMediaType'
import { serializePageContextClientSide } from '../serializePageContextClientSide'
import { sanitizeJson } from './injectAssets/sanitizeJson'
import { assertPageContextProvidedByUser } from '../../shared/assertPageContextProvidedByUser'

export { injectAssets__public }
export { injectAssets }
export { injectAssetsBeforeRender }
export { injectAssetsAfterRender }
export type { PageContextInjectAssets }
export { PageAsset }

type PageAsset = {
  src: string
  assetType: 'script' | 'style' | 'preload'
  mediaType: null | NonNullable<MediaType>['mediaType']
  preloadType: null | NonNullable<MediaType>['preloadType']
}

async function injectAssets__public(htmlString: string, pageContext: Record<string, unknown>): Promise<string> {
  assertUsage(
    typeof htmlString === 'string',
    '[injectAssets(htmlString, pageContext)]: Argument `htmlString` should be a string.',
  )
  assertUsage(pageContext, '[injectAssets(htmlString, pageContext)]: Argument `pageContext` is missing.')
  const errMsg = (body: string) =>
    '[injectAssets(htmlString, pageContext)]: ' +
    body +
    '. Make sure that `pageContext` is the object that `vite-plugin-ssr` provided to your `render(pageContext)` hook.'
  assertUsage(hasProp(pageContext, 'urlPathname', 'string'), errMsg('`pageContext.urlPathname` should be a string'))
  assertUsage(hasProp(pageContext, '_pageId', 'string'), errMsg('`pageContext._pageId` should be a string'))
  assertUsage(hasProp(pageContext, '_getPageAssets'), errMsg('`pageContext._getPageAssets` is missing'))
  assertUsage(hasProp(pageContext, '_passToClient', 'string[]'), errMsg('`pageContext._passToClient` is missing'))
  castProp<() => Promise<PageAsset[]>, typeof pageContext, '_getPageAssets'>(pageContext, '_getPageAssets')
  htmlString = await injectAssets(htmlString, pageContext as any)
  return htmlString
}

type PageContextInjectAssets = {
  urlPathname: string
  _getPageAssets: () => Promise<PageAsset[]>
  _pageId: string
  _passToClient: string[]
  _skipAssetInject?: true
  _pageContextProvidedByUserPromise: Promise<unknown> | null
  _renderHook: { hookFilePath: string; hookName: 'render' }
}
async function injectAssets(htmlString: string, pageContext: PageContextInjectAssets): Promise<string> {
  htmlString = await injectAssetsBeforeRender(htmlString, pageContext)
  htmlString = await injectAssetsAfterRender(htmlString, pageContext)
  return htmlString
}

async function injectAssetsBeforeRender(htmlString: string, pageContext: PageContextInjectAssets) {
  assert(htmlString)
  assert(typeof htmlString === 'string')

  // Ensure existence of `<head>` (Vite's `transformIndexHtml()` is buggy when `<head>` is missing)
  htmlString = ensureHeadTagExistence(htmlString)

  // Inject Vite transformations
  const { urlPathname } = pageContext
  assert(typeof urlPathname === 'string' && urlPathname.startsWith('/'))
  htmlString = await applyViteHtmlTransform(htmlString, urlPathname)

  if (pageContext._skipAssetInject) {
    return htmlString
  }

  const pageAssets = await pageContext._getPageAssets()

  // Inject script
  const scripts = pageAssets.filter(({ assetType }) => assetType === 'script')
  scripts.forEach((script) => {
    htmlString = injectScript(htmlString, script)
  })

  // Inject preload links
  const preloadAssets = pageAssets
    // prettier-ignore
    .filter(({ assetType }) => assetType === 'preload' || assetType === 'style')
  /* In development, Vite automatically inject styles, but we still inject `<link rel="stylesheet" type="text/css" href="${src}">` tags in order to avoid style flashing.
       - https://github.com/vitejs/vite/issues/2282
       - https://github.com/brillout/vite-plugin-ssr/issues/261
    .filter(({ assetType }) => !(assetType === 'style' && !ssrEnv.isProduction))
  */
  const linkTags = preloadAssets.map((pageAsset) => {
    const isEsModule = pageAsset.preloadType === 'script'
    return inferAssetTag(pageAsset, isEsModule)
  })
  htmlString = injectLinkTags(htmlString, linkTags)

  return htmlString
}

async function injectAssetsAfterRender(htmlString: string, pageContext: PageContextInjectAssets) {
  // Inject pageContext__client
  assertUsage(
    !injectPageInfoAlreadyDone(htmlString),
    'Assets are being injected twice into your HTML. Make sure to remove your superfluous `injectAssets()` call (`vite-plugin-ssr` already automatically calls `injectAssets()`).',
  )
  if (pageContext._pageContextProvidedByUserPromise !== null) {
    const pageContextProvidedByUser = await pageContext._pageContextProvidedByUserPromise
    assertPageContextProvidedByUser(pageContextProvidedByUser, { hook: pageContext._renderHook })
    Object.assign(pageContext, pageContextProvidedByUser)
  }
  if (pageContext._skipAssetInject) {
    return htmlString
  }
  htmlString = injectPageContext(htmlString, pageContext)
  return htmlString
}

async function applyViteHtmlTransform(htmlString: string, urlPathname: string): Promise<string> {
  const ssrEnv = getSsrEnv()
  if (ssrEnv.isProduction) {
    return htmlString
  }
  htmlString = await ssrEnv.viteDevServer.transformIndexHtml(urlPathname, htmlString)
  htmlString = removeDuplicatedBaseUrl(htmlString, ssrEnv.baseUrl)
  return htmlString
}

function removeDuplicatedBaseUrl(htmlString: string, baseUrl: string): string {
  // Proper fix is to add Vite option to skip this: https://github.com/vitejs/vite/blob/aaa26a32501c857d854e9d9daca2a88a9e086392/packages/vite/src/node/server/middlewares/indexHtml.ts#L62-L67
  const baseUrlNormalized = normalizeBaseUrl(baseUrl)
  if (baseUrlNormalized === '/') {
    return htmlString
  }
  assert(!baseUrlNormalized.endsWith('/'))
  htmlString = htmlString.split(baseUrlNormalized + baseUrlNormalized).join(baseUrlNormalized)
  return htmlString
}

const pageInfoInjectionBegin = '<script id="vite-plugin-ssr_pageContext" type="application/json">'
function injectPageContext(htmlString: string, pageContext: { _pageId: string; _passToClient: string[] }): string {
  const pageContextSerialized = sanitizeJson(serializePageContextClientSide(pageContext))
  const injection = `${pageInfoInjectionBegin}${pageContextSerialized}</script>`
  return injectAtHtmlEnd(htmlString, injection)
}
function injectPageInfoAlreadyDone(htmlString: string) {
  return htmlString.includes(pageInfoInjectionBegin)
}

function injectScript(htmlString: string, script: PageAsset): string {
  const isEsModule = true
  const injection = inferAssetTag(script, isEsModule)
  return injectAtHtmlEnd(htmlString, injection)
}

const headClose = '</head>'
function injectLinkTags(htmlString: string, linkTags: string[]): string {
  assert(linkTags.every((tag) => tag.startsWith('<') && tag.endsWith('>')))
  const injection = linkTags.join('')
  return injectAtClosingTag(htmlString, headClose, injection)
}

const headOpen = /<head(>| [^>]*>)/
function injectAtHtmlBegin(htmlString: string, injection: string): string {
  if (headOpen.test(htmlString)) {
    return injectAtOpeningTag(htmlString, headOpen, injection)
  }

  const htmlBegin = /<html(>| [^>]*>)/
  if (htmlBegin.test(htmlString)) {
    return injectAtOpeningTag(htmlString, htmlBegin, injection)
  }

  if (htmlString.toLowerCase().startsWith('<!doctype')) {
    const lines = htmlString.split('\n')
    return [...slice(lines, 0, 1), injection, ...slice(lines, 1, 0)].join('\n')
  } else {
    return injection + '\n' + htmlString
  }
}

function injectAtHtmlEnd(htmlString: string, injection: string): string {
  const bodyClose = '</body>'
  if (htmlString.includes(bodyClose)) {
    return injectAtClosingTag(htmlString, bodyClose, injection)
  }

  const htmlClose = '</html>'
  if (htmlString.includes(htmlClose)) {
    return injectAtClosingTag(htmlString, htmlClose, injection)
  }

  return htmlString + '\n' + injection
}

function injectAtOpeningTag(htmlString: string, openingTag: RegExp, injection: string): string {
  const matches = htmlString.match(openingTag)
  assert(matches && matches.length >= 1)
  const tag = matches[0]
  assert(tag)
  const htmlParts = htmlString.split(tag)
  assert(htmlParts.length >= 2)

  // Insert `injection` after first `tag`
  const before = slice(htmlParts, 0, 1)
  const after = slice(htmlParts, 1, 0).join(tag)
  return before + tag + injection + after
}

function injectAtClosingTag(htmlString: string, closingTag: string, injection: string): string {
  assert(closingTag.startsWith('</'))
  assert(closingTag.endsWith('>'))
  assert(!closingTag.includes(' '))

  const htmlParts = htmlString.split(closingTag)
  assert(htmlParts.length >= 2)

  // Insert `injection` before last `closingTag`
  const before = slice(htmlParts, 0, -1).join(closingTag)
  const after = slice(htmlParts, -1, 0)
  return before + injection + closingTag + after
}

function inferAssetTag(pageAsset: PageAsset, isEsModule: boolean): string {
  const { src, assetType, mediaType, preloadType } = pageAsset
  assert(isEsModule === false || assetType === 'script' || preloadType === 'script')
  if (assetType === 'script') {
    assert(mediaType === 'text/javascript')
    if (isEsModule) {
      return `<script type="module" src="${src}"></script>`
    } else {
      return `<script src="${src}"></script>`
    }
  }
  if (assetType === 'style') {
    // CSS has highest priority.
    // Would there be any advantage of using a preload tag for a css file instead of loading it right away?
    return `<link rel="stylesheet" type="text/css" href="${src}">`
  }
  if (assetType === 'preload') {
    if (preloadType === 'font') {
      // `crossorigin` is needed for fonts, see https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload#cors-enabled_fetches
      return `<link rel="preload" as="font" crossorigin type="${mediaType}" href="${src}">`
    }
    if (preloadType === 'script') {
      assert(mediaType === 'text/javascript')
      if (isEsModule) {
        return `<link rel="modulepreload" as="script" type="${mediaType}" href="${src}">`
      } else {
        return `<link rel="preload" as="script" type="${mediaType}" href="${src}">`
      }
    }
    const attributeAs = !preloadType ? '' : ` as="${preloadType}"`
    const attributeType = !mediaType ? '' : ` type="${mediaType}"`
    return `<link rel="preload" href="${src}"${attributeAs}${attributeType}>`
  }
  assert(false)
}

function ensureHeadTagExistence(htmlString: string): string {
  if (headOpen.test(htmlString)) {
    return htmlString
  }
  htmlString = injectAtHtmlBegin(htmlString, '<head></head>')
  return htmlString
}
