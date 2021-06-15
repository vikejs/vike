import { assert, assertUsage, castProp, hasProp, higherFirst, normalizePath, slice } from '../utils'
import { getPreloadUrls } from '../getPreloadTags.node'
import { getSsrEnv } from '../ssrEnv.node'
import { getViteManifest, ViteManifest } from '../getViteManifest.node'
import { prependBaseUrl } from '../baseUrlHandling'
import devalue from 'devalue'
import { isAbsolute } from 'path'
import { inferMediaType, MediaType } from './inferMediaType'

export { injectAssets }
export { injectAssets_internal }
export { getPageAssets }
export { PageAssets }

type PageAssets = PageAsset[]
type PageAsset = {
  src: string
  assetType: 'script' | 'style' | 'preload'
  mediaType: null | NonNullable<MediaType>['mediaType']
  preloadType: null | NonNullable<MediaType>['preloadType']
}

async function getPageAssets(
  dependencies: string[],
  pageClientFilePath: string,
  isPreRendering: boolean
): Promise<PageAsset[]> {
  assert(dependencies.every((filePath) => isAbsolute(filePath)))

  const { isProduction = false } = getSsrEnv()
  let clientManifest: null | ViteManifest = null
  let serverManifest: null | ViteManifest = null
  if (isPreRendering || isProduction) {
    const manifests = retrieveViteManifest(isPreRendering)
    clientManifest = manifests.clientManifest
    serverManifest = manifests.serverManifest
  }

  const preloadAssets: string[] = await getPreloadUrls(dependencies, clientManifest, serverManifest)

  let pageAssets: PageAsset[] = preloadAssets.map((src) => {
    const { mediaType = null, preloadType = null } = inferMediaType(src) || {}
    const assetType = mediaType === 'text/css' ? 'style' : 'preload'
    return {
      src,
      assetType,
      mediaType,
      preloadType
    }
  })

  const scriptSrc = !isProduction ? pageClientFilePath : resolveScriptSrc(pageClientFilePath, clientManifest!)
  pageAssets.push({
    src: scriptSrc,
    assetType: 'script',
    mediaType: 'text/javascript',
    preloadType: null
  })

  pageAssets = pageAssets.map((pageAsset) => {
    pageAsset.src = prependBaseUrl(normalizePath(pageAsset.src))
    return pageAsset
  })

  sortPageAssetsForHttpPush(pageAssets)

  return pageAssets
}

function sortPageAssetsForHttpPush(pageAssets: PageAsset[]) {
  pageAssets.sort(
    higherFirst(({ assetType, preloadType }) => {
      let priority = 0

      // CSS has highest priority
      if (assetType === 'style') return priority
      priority--
      if (preloadType === 'style') return priority
      priority--

      // Visual assets have high priority
      if (preloadType === 'font') return priority
      priority--
      if (preloadType === 'image') return priority
      priority--

      // JavaScript has lowest priority
      if (preloadType === 'script') return priority - 1
      if (assetType === 'script') return priority - 2

      return priority
    })
  )
}

function retrieveViteManifest(isPreRendering: boolean): { clientManifest: ViteManifest; serverManifest: ViteManifest } {
  const { clientManifest, serverManifest, clientManifestPath, serverManifestPath } = getViteManifest()
  const userOperation = isPreRendering
    ? 'running `$ vite-plugin-ssr prerender`'
    : 'running the server with `isProduction: true`'
  assertUsage(
    clientManifest && serverManifest,
    'You are ' +
      userOperation +
      " but you didn't build your app yet: make sure to run `$ vite build && vite build --ssr` before. (Following build manifest is missing: `" +
      clientManifestPath +
      '` and/or `' +
      serverManifestPath +
      '`.)'
  )
  return { clientManifest, serverManifest }
}

async function injectAssets(htmlDocument: string, pageContext: Record<string, unknown>): Promise<string> {
  const errMsg = (body: string) =>
    '[html.injectAssets(htmlDocument, pageContext)]: ' +
    body +
    '. Make sure that `pageContext` is the object that `vite-plugin-ssr` provided to your `render(pageContext)` hook.'
  assertUsage(hasProp(pageContext, 'urlNormalized', 'string'), errMsg('`pageContext.urlNormalized` should be a string'))
  assertUsage(hasProp(pageContext, 'pageAssets'), errMsg('`pageContext.pageAssets` is missing'))
  assertUsage(hasProp(pageContext, '_pageId', 'string'), errMsg('`pageContext._pageId` should be a string'))
  assertUsage(
    hasProp(pageContext, '_pageContextClient', 'object'),
    errMsg('`pageContext._pageContextClient` is missing')
  )
  assertUsage(hasProp(pageContext, '_pageFilePath', 'string'), errMsg('`pageContext._pageFilePath` is missing'))
  assertUsage(
    hasProp(pageContext, '_pageClientFilePath', 'string'),
    errMsg('`pageContext._pageClientFilePath` is missing')
  )
  castProp<PageAssets, typeof pageContext, 'pageAssets'>(pageContext, 'pageAssets')
  pageContext.pageAssets
  htmlDocument = await injectAssets_internal(htmlDocument, pageContext)
  return htmlDocument
}

async function injectAssets_internal(
  htmlDocument: string,
  pageContext: {
    urlNormalized: string
    pageAssets: PageAssets
    _pageId: string
    _pageContextClient: Record<string, unknown>
    _pageFilePath: string
    _pageClientFilePath: string
  }
): Promise<string> {
  // Inject Vite transformations
  const { urlNormalized } = pageContext
  assert(typeof urlNormalized === 'string')
  htmlDocument = await applyViteHtmlTransform(htmlDocument, urlNormalized)

  // Inject pageContext__client
  htmlDocument = injectPageInfo(htmlDocument, pageContext)

  // Inject script
  const scripts = pageContext.pageAssets.filter(({ assetType }) => assetType === 'script')
  assert(scripts.length === 1)
  htmlDocument = injectScript(htmlDocument, scripts[0])

  // Inject preload links
  const preloadAssets = pageContext.pageAssets.filter(
    ({ assetType }) => assetType === 'preload' || assetType === 'style'
  )
  const linkTags = preloadAssets.map((pageAsset) => {
    const isEsModule = pageAsset.preloadType === 'script'
    return inferAssetTag(pageAsset, isEsModule)
  })
  htmlDocument = injectLinkTags(htmlDocument, linkTags)

  return htmlDocument
}

async function applyViteHtmlTransform(htmlDocument: string, urlNormalized: string): Promise<string> {
  const ssrEnv = getSsrEnv()
  if (ssrEnv.isProduction) {
    return htmlDocument
  }
  htmlDocument = await ssrEnv.viteDevServer.transformIndexHtml(urlNormalized, htmlDocument)
  return htmlDocument
}

function resolveScriptSrc(filePath: string, clientManifest: ViteManifest): string {
  assert(filePath.startsWith('/'))
  assert(getSsrEnv().isProduction)
  const manifestKey = filePath.slice(1)
  const manifestVal = clientManifest[manifestKey]
  assert(manifestVal)
  assert(manifestVal.isEntry)
  let { file } = manifestVal
  assert(!file.startsWith('/'))
  return '/' + file
}

function injectPageInfo(
  htmlDocument: string,
  pageContext: { _pageId: string; _pageContextClient: Record<string, unknown> }
): string {
  assert(pageContext._pageContextClient._pageId)
  assert(pageContext._pageContextClient._pageId === pageContext._pageId)
  const pageContextSerialized = devalue(pageContext._pageContextClient)
  const injection = `<script>window.__vite_plugin_ssr__pageContext = ${pageContextSerialized}</script>`
  return injectEnd(htmlDocument, injection)
}

function injectScript(htmlDocument: string, script: PageAsset): string {
  const isEsModule = true
  const injection = inferAssetTag(script, isEsModule)
  return injectEnd(htmlDocument, injection)
}

function injectLinkTags(htmlDocument: string, linkTags: string[]): string {
  assert(linkTags.every((tag) => tag.startsWith('<') && tag.endsWith('>')))
  const injection = linkTags.join('')
  return injectBegin(htmlDocument, injection)
}

function injectBegin(htmlDocument: string, injection: string): string {
  const headOpen = /<head[^>]*>/
  if (headOpen.test(htmlDocument)) {
    return injectAtOpeningTag(htmlDocument, headOpen, injection)
  }

  const htmlBegin = /<html[^>]*>/
  if (htmlBegin.test(htmlDocument)) {
    return injectAtOpeningTag(htmlDocument, htmlBegin, injection)
  }

  if (htmlDocument.toLowerCase().startsWith('<!doctype')) {
    const lines = htmlDocument.split('\n')
    return [...slice(lines, 0, 1), injection, ...slice(lines, 1, 0)].join('\n')
  } else {
    return injection + '\n' + htmlDocument
  }
}

function injectEnd(htmlDocument: string, injection: string): string {
  const bodyClose = '</body>'
  if (htmlDocument.includes(bodyClose)) {
    return injectAtClosingTag(htmlDocument, bodyClose, injection)
  }

  const htmlClose = '</html>'
  if (htmlDocument.includes(htmlClose)) {
    return injectAtClosingTag(htmlDocument, htmlClose, injection)
  }

  return htmlDocument + '\n' + injection
}

function injectAtOpeningTag(htmlDocument: string, openingTag: RegExp, injection: string): string {
  const matches = htmlDocument.match(openingTag)
  assert(matches && matches.length >= 1)
  const tag = matches[0]
  const htmlParts = htmlDocument.split(tag)
  assert(htmlParts.length >= 2)

  // Insert `injection` after first `tag`
  const before = slice(htmlParts, 0, 1)
  const after = slice(htmlParts, 1, 0).join(tag)
  return before + tag + injection + after
}

function injectAtClosingTag(htmlDocument: string, closingTag: string, injection: string): string {
  assert(closingTag.startsWith('</'))
  assert(closingTag.endsWith('>'))
  assert(!closingTag.includes(' '))

  const htmlParts = htmlDocument.split(closingTag)
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
    // CSS has utmost priority.
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
