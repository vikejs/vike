import { assert, assertUsage, assertWarning, castProp, hasProp, normalizeBaseUrl } from '../utils'
import type { MediaType } from './inferMediaType'
import { serializePageContextClientSide } from '../serializePageContextClientSide'
import { sanitizeJson } from './injectAssets/sanitizeJson'
import { assertPageContextProvidedByUser } from '../../shared/assertPageContextProvidedByUser'
import { createHtmlHeadIfMissing, injectHtmlSnippet } from './injectAssets/injectHtmlSnippet'
import type { ViteDevServer } from 'vite'

export { injectAssets__public }
export { injectAssets }
export { injectAssetsBeforeRender }
export { injectAssetsAfterRender }
export { applyViteHtmlTransform }
export type { PageContextInjectAssets }
export { PageAsset }

type PageAsset = {
  src: string
  assetType: 'script' | 'style' | 'preload'
  mediaType: null | NonNullable<MediaType>['mediaType']
  preloadType: null | NonNullable<MediaType>['preloadType']
}

async function injectAssets__public(htmlString: string, pageContext: Record<string, unknown>): Promise<string> {
  assertWarning(false, '`_injectAssets()` is deprecated and will be removed.', { onlyOnce: true })
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
  _isHtmlOnly: boolean
  _pageContextProvidedByUserPromise: Promise<unknown> | null
  _renderHook: { hookFilePath: string; hookName: 'render' }
  _isProduction: boolean
  _viteDevServer: null | ViteDevServer
  _baseUrl: string
}
async function injectAssets(htmlString: string, pageContext: PageContextInjectAssets): Promise<string> {
  htmlString = await injectAssetsBeforeRender(htmlString, pageContext, null)
  htmlString = await injectAssetsAfterRender(htmlString, pageContext)
  htmlString = await applyViteHtmlTransform(htmlString, pageContext)
  return htmlString
}

async function injectAssetsBeforeRender(htmlString: string, pageContext: PageContextInjectAssets, streamInjectionBuffer: null | string[]) {
  assert(htmlString)
  assert(typeof htmlString === 'string')

  // Ensure existence of `<head>` (Vite's `transformIndexHtml()` is buggy when `<head>` is missing)
  htmlString = createHtmlHeadIfMissing(htmlString)

  if (pageContext._skipAssetInject) {
    return htmlString
  }

  const pageAssets = await pageContext._getPageAssets()

  const htmlSnippets: {
    htmlSnippet: string
    position: 'DOCUMENT_END' | 'HEAD_CLOSING' | 'HEAD_OPENING'
  }[] = []

  pageAssets.forEach((pageAsset) => {
    const { assetType, preloadType } = pageAsset
    if (assetType === 'script' || (assetType === 'preload' && preloadType === 'script')) {
      const htmlSnippet = inferAssetTag(pageAsset)
      htmlSnippets.push({ htmlSnippet, position: 'DOCUMENT_END' })
      return
    }
    if (
      assetType === 'style' ||
      (assetType === 'preload' && preloadType === 'style') ||
      (assetType === 'preload' && preloadType === 'font')
    ) {
      // In development, Vite automatically inject styles, but we still inject `<link rel="stylesheet" type="text/css" href="${src}">` tags in order to avoid FOUC (flash of unstyled content).
      //   - https://github.com/vitejs/vite/issues/2282
      //   - https://github.com/brillout/vite-plugin-ssr/issues/261
      const htmlSnippet = inferAssetTag(pageAsset)
      htmlSnippets.push({ htmlSnippet, position: 'HEAD_OPENING' })
      return
    }
    if (assetType === 'preload') {
      const htmlSnippet = inferAssetTag(pageAsset)
      htmlSnippets.push({ htmlSnippet, position: 'DOCUMENT_END' })
      return
    }
    assert(false, { assetType, preloadType })
  })

  assert(htmlSnippets.every(({ htmlSnippet }) => htmlSnippet.startsWith('<') && htmlSnippet.endsWith('>')))
  ;['HEAD_OPENING' as const, 'HEAD_CLOSING' as const, 'DOCUMENT_END' as const].forEach((position) => {
    const htmlInjection = htmlSnippets.filter((h) => h.position === position).map((h) => h.htmlSnippet).join('')
    if( position === 'DOCUMENT_END' && streamInjectionBuffer ) {
      streamInjectionBuffer.push(htmlInjection)
      return
    }
    htmlString = injectHtmlSnippet(
      position,
      htmlInjection,
      htmlString,
    )
  })

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
  if (!pageContext._isHtmlOnly) {
    htmlString = injectPageContext(htmlString, pageContext)
  }
  return htmlString
}

async function applyViteHtmlTransform(
  htmlString: string,
  pageContext: { _isProduction: boolean; _viteDevServer: null | ViteDevServer, _baseUrl: string, urlPathname: string },
): Promise<string> {
  if (pageContext._isProduction) {
    return htmlString
  }
  assert(pageContext._viteDevServer)
  const { urlPathname } = pageContext
  assert(typeof urlPathname === 'string' && urlPathname.startsWith('/'))
  htmlString = await pageContext._viteDevServer.transformIndexHtml(urlPathname, htmlString)
  htmlString = removeDuplicatedBaseUrl(htmlString, pageContext._baseUrl)
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
  const htmlSnippet = `${pageInfoInjectionBegin}${pageContextSerialized}</script>`
  htmlString = injectHtmlSnippet('DOCUMENT_END', htmlSnippet, htmlString)
  return htmlString
}
function injectPageInfoAlreadyDone(htmlString: string) {
  return htmlString.includes(pageInfoInjectionBegin)
}

function inferAssetTag(pageAsset: PageAsset): string {
  const { src, assetType, mediaType, preloadType } = pageAsset
  if (assetType === 'script') {
    assert(mediaType === 'text/javascript')
    return `<script type="module" src="${src}"></script>`
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
      return `<link rel="modulepreload" as="script" type="${mediaType}" href="${src}">`
    }
    const attributeAs = !preloadType ? '' : ` as="${preloadType}"`
    const attributeType = !mediaType ? '' : ` type="${mediaType}"`
    return `<link rel="preload" href="${src}"${attributeAs}${attributeType}>`
  }
  assert(false)
}
