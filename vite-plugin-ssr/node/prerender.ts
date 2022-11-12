import './page-files/setup'
import path from 'path'
import { isErrorPageId, loadPageRoutes, route } from '../shared/route'
import {
  assert,
  assertUsage,
  assertWarning,
  hasProp,
  isPlainObject,
  projectInfo,
  objectAssign,
  isObjectWithKeys,
  isCallable,
  getOutDirs_prerender,
  loadModuleAtRuntime,
  isObject,
  hasPropertyGetter,
  assertPosixPath,
  urlToFile,
  callHookWithTimeout
} from './utils'
import { pLimit, PLimit } from '../utils/pLimit'
import { loadPageFilesServer, prerenderPage, renderStatic404Page } from './renderPage'
import { blue, green, gray, cyan } from 'picocolors'
import { cpus } from 'os'
import { getPageFilesAll, PageFile } from '../shared/getPageFiles'
import { getGlobalContext, GlobalContext } from './globalContext'
import { resolveConfig } from 'vite'
import { getConfigVps } from './plugin/plugins/config/assertConfigVps'
import type { InlineConfig } from 'vite'
import { setProductionEnvVar } from '../shared/setProduction'
import { getPageFilesServerSide } from '../shared/getPageFiles/analyzePageServerSide/getPageFilesServerSide'
import { getPageContextRequestUrl } from '../shared/getPageContextRequestUrl'
import { getUrlFromRouteString } from '../shared/route/resolveRouteString'

export { prerender }

type HtmlFile = {
  urlOriginal: string
  pageContext: Record<string, unknown>
  htmlString: string
  pageContextSerialized: string | null
  doNotCreateExtraDirectory: boolean
  pageId: string | null
}

type DoNotPrerenderList = { pageId: string; pageFilePath: string }[]
type PrerenderedPageIds = Record<string, { urlOriginal: string; _prerenderHookFile: string | null }>

type GlobalPrerenderingContext = GlobalContext & {
  _allPageIds: string[]
  _pageFilesAll: PageFile[]
  _isPreRendering: true
  _usesClientRouter: boolean
  _noExtraDir: boolean
  prerenderPageContexts: PageContext[]
  _urlProcessor: null
}

type PageContext = GlobalPrerenderingContext & {
  urlOriginal: string
  _prerenderHookFile: string | null
  _pageContextAlreadyProvidedByPrerenderHook?: true
}

const wrongViteConfigErrorMessage =
  'Your Vite config should enable pre-rendering (e.g. `ssr({ prerender: true })`), see https://vite-plugin-ssr.com/prerender-config'

async function prerender(
  options: {
    /** Initial `pageContext` values */
    pageContextInit?: Record<string, unknown>
    /**
     * The Vite config.
     *
     * This is optional and, if omitted, then Vite will automatically load your `vite.config.js`.
     *
     * We recommend to either omit this option or set it to `prerender({ viteConfig: { root }})`: the `vite.config.js` file living at `root` will be loaded.
     *
     * Alternatively you can:
     *  - Set `prerender({ viteConfig: { configFile: require.resolve('./path/to/vite.config.js') }})`.
     *  - Not load any `vite.config.js` file and, instead, use `prerender({ viteConfig: { configFile: false, ...myViteConfig }})` to programmatically define the entire Vite config.
     *
     * You can also load a `vite.config.js` file while overriding parts of the Vite config.
     *
     * See https://vitejs.dev/guide/api-javascript.html#inlineconfig for more information.
     *
     * @default { root: process.cwd() }
     *
     */
    viteConfig?: InlineConfig
    /**
     * @internal
     * Don't use without having talked to a vite-plugin-ssr maintainer.
     */
    onPagePrerender?: Function

    // =====================
    // ==== Deprecated  ====
    // =====================
    /** @deprecated Define `prerender({ viteConfig: { root }})` instead. */
    root?: string
    /** @deprecated Define `prerender({ viteConfig: { configFile }})` instead. */
    configFile?: string
    /** @deprecated Define `partial` in vite.config.js instead, see https://vite-plugin-ssr.com/prerender-config */
    partial?: boolean
    /** @deprecated Define `noExtraDir` in vite.config.js instead, see https://vite-plugin-ssr.com/prerender-config */
    noExtraDir?: boolean
    /** @deprecated Define `parallel` in vite.config.js instead, see https://vite-plugin-ssr.com/prerender-config */
    parallel?: number
    /** @deprecated */
    outDir?: string
    /** @deprecated */
    base?: string
  } = {}
) {
  checkOutdatedOptions(options)

  const logLevel = !!options.onPagePrerender ? 'warn' : 'info'
  if (logLevel === 'info') {
    console.log(`${cyan(`vite-plugin-ssr v${projectInfo.projectVersion}`)} ${green('pre-rendering HTML...')}`)
  }

  setProductionEnvVar()

  disableReactStreaming()

  const viteConfig = await resolveConfig(options.viteConfig || {}, 'vite-plugin-ssr pre-rendering' as any, 'production')
  assertLoadedConfig(viteConfig, options)
  const configVps = await getConfigVps(viteConfig)

  const { outDirClient } = getOutDirs_prerender(viteConfig)
  const { root } = viteConfig
  const prerenderConfig = configVps.prerender
  assertUsage(prerenderConfig !== false, wrongViteConfigErrorMessage)
  assert(isObject(prerenderConfig))
  const { partial = false, noExtraDir = false, parallel = true } = prerenderConfig

  const concurrencyLimit = pLimit(
    parallel === false || parallel === 0 ? 1 : parallel === true || parallel === undefined ? cpus().length : parallel
  )

  const globalContext = await getGlobalContext(true)
  objectAssign(globalContext, {
    _isPreRendering: true as const,
    _urlProcessor: null,
    _noExtraDir: noExtraDir ?? false,
    _root: root,
    prerenderPageContexts: [] as PageContext[]
  })
  assert(globalContext._isProduction)
  objectAssign(globalContext, {
    _usesClientRouter: globalContext._manifestPlugin.usesClientRouter
  })

  {
    const { pageFilesAll, allPageIds } = await getPageFilesAll(false, globalContext._isProduction)
    objectAssign(globalContext, {
      _pageFilesAll: pageFilesAll,
      _allPageIds: allPageIds
    })
    globalContext._pageFilesAll.forEach(assertExportNames)
  }

  objectAssign(globalContext, options.pageContextInit)

  const doNotPrerenderList: DoNotPrerenderList = []
  await collectDoNoPrerenderList(globalContext, doNotPrerenderList, concurrencyLimit)

  await callPrerenderHooks(globalContext, concurrencyLimit)

  await handlePagesWithStaticRoutes(globalContext, doNotPrerenderList, concurrencyLimit)

  await callOnBeforePrerenderHook(globalContext)

  const prerenderPageIds: PrerenderedPageIds = {}
  const htmlFiles: HtmlFile[] = []
  await routeAndPrerender(globalContext, htmlFiles, prerenderPageIds, concurrencyLimit)

  warnContradictoryNoPrerenderList(prerenderPageIds, doNotPrerenderList)

  await prerender404Page(htmlFiles, globalContext)

  if (logLevel === 'info') {
    console.log(`${green(`✓`)} ${htmlFiles.length} HTML documents pre-rendered.`)
  }

  await Promise.all(
    htmlFiles.map((htmlFile) =>
      writeHtmlFile(
        htmlFile,
        root,
        outDirClient,
        doNotPrerenderList,
        concurrencyLimit,
        options.onPagePrerender,
        logLevel
      )
    )
  )

  warnMissingPages(prerenderPageIds, doNotPrerenderList, globalContext, partial)
}

async function collectDoNoPrerenderList(
  globalContext: GlobalPrerenderingContext,
  doNotPrerenderList: DoNotPrerenderList,
  concurrencyLimit: PLimit
) {
  await Promise.all(
    globalContext._pageFilesAll
      .filter((p) => {
        assertExportNames(p)
        if (!p.exportNames?.includes('doNotPrerender')) return false
        assertUsage(
          p.fileType !== '.page.client',
          `${p.filePath} (which is a \`.page.client.js\` file) has \`export { doNotPrerender }\` but it is only allowed in \`.page.server.js\` or \`.page.js\` files`
        )
        return true
      })
      .map((p) =>
        concurrencyLimit(async () => {
          assert(p.loadFile)
          await p.loadFile()
        })
      )
  )
  globalContext._allPageIds.forEach((pageId) => {
    const pageFilesServerSide = getPageFilesServerSide(globalContext._pageFilesAll, pageId)
    for (const p of pageFilesServerSide) {
      if (!p.exportNames?.includes('doNotPrerender')) continue
      const { fileExports } = p
      assert(fileExports)
      assert(hasProp(fileExports, 'doNotPrerender'))
      const { doNotPrerender } = fileExports
      assertUsage(
        doNotPrerender === true || doNotPrerender === false,
        `The \`export { doNotPrerender }\` value of ${p.filePath} should be \`true\` or \`false\``
      )
      if (!doNotPrerender) {
        // Do pre-render `pageId`
        return
      } else {
        // Don't pre-render `pageId`
        doNotPrerenderList.push({ pageId, pageFilePath: p.filePath })
      }
    }
  })
}

function assertExportNames(pageFile: PageFile) {
  const { exportNames, fileType } = pageFile
  assert(exportNames || fileType === '.page.route', wrongViteConfigErrorMessage)
}

async function callPrerenderHooks(globalContext: GlobalPrerenderingContext, concurrencyLimit: PLimit) {
  // Render URLs returned by `prerender()` hooks
  await Promise.all(
    globalContext._pageFilesAll
      .filter((p) => {
        assertExportNames(p)
        if (!p.exportNames?.includes('prerender')) return false
        assertUsage(
          p.fileType === '.page.server',
          `${p.filePath} (which is a \`${p.fileType}.js\` file) has \`export { prerender }\` but it is only allowed in \`.page.server.js\` files`
        )
        return true
      })
      .map((p) =>
        concurrencyLimit(async () => {
          await p.loadFile?.()

          const prerender = p.fileExports?.prerender
          if (!prerender) return
          assertUsage(isCallable(prerender), `\`export { prerender }\` of ${p.filePath} should be a function.`)
          const prerenderHookFile = p.filePath
          assert(prerenderHookFile)

          const prerenderResult: unknown = await prerender()
          const result = normalizePrerenderResult(prerenderResult, prerenderHookFile)

          result.forEach(({ url, pageContext }) => {
            assert(typeof url === 'string')
            assert(url.startsWith('/'))
            assert(pageContext === null || isPlainObject(pageContext))
            let pageContextFound: PageContext | undefined = globalContext.prerenderPageContexts.find(
              (pageContext) => pageContext.urlOriginal === url
            )
            if (!pageContextFound) {
              const pageContext = createPageContextObject(url, globalContext)
              objectAssign(pageContext, {
                _prerenderHookFile: prerenderHookFile
              })
              globalContext.prerenderPageContexts.push(pageContext)
              pageContextFound = pageContext
            }
            if (pageContext) {
              objectAssign(pageContextFound, {
                _pageContextAlreadyProvidedByPrerenderHook: true,
                ...pageContext
              })
            }
          })
        })
      )
  )
}

async function handlePagesWithStaticRoutes(
  globalContext: GlobalPrerenderingContext,
  doNotPrerenderList: DoNotPrerenderList,
  concurrencyLimit: PLimit
) {
  // Pre-render pages with a static route
  const { pageRoutes } = await loadPageRoutes(globalContext)
  await Promise.all(
    pageRoutes.map((pageRoute) =>
      concurrencyLimit(async () => {
        const { pageId } = pageRoute

        if (doNotPrerenderList.find((p) => p.pageId === pageId)) {
          return
        }

        let urlOriginal: string
        if (!('routeString' in pageRoute)) {
          // Abort since the page's route is a Route Function
          assert(pageRoute.routeType === 'FUNCTION')
          return
        } else {
          const url = getUrlFromRouteString(pageRoute.routeString)
          if (!url) {
            // Abort since no URL can be deduced from a parameterized Route String
            return
          }
          urlOriginal = url
        }
        assert(urlOriginal.startsWith('/'))

        // Already included in a `prerender()` hook
        if (globalContext.prerenderPageContexts.find((pageContext) => pageContext.urlOriginal === urlOriginal)) {
          // Not sure if there is a use case for it, but why not allowing users to use a `prerender()` hook in order to provide some `pageContext` for a page with a static route
          return
        }

        const routeParams = {}
        const pageContext = createPageContextObject(urlOriginal, globalContext)
        objectAssign(pageContext, {
          _prerenderHookFile: null,
          routeParams,
          _pageId: pageId,
          _routeMatches: [
            {
              pageId,
              routeType: pageRoute.pageRouteFilePath ? ('STRING' as const) : ('FILESYSTEM' as const),
              routeString: urlOriginal,
              routeParams
            }
          ]
        })
        objectAssign(pageContext, await loadPageFilesServer(pageContext))

        globalContext.prerenderPageContexts.push(pageContext)
      })
    )
  )
}

function createPageContextObject(urlOriginal: string, globalContext: GlobalPrerenderingContext) {
  const pageContext = {
    urlOriginal,
    ...globalContext
  }
  // We cannot add the computed URL properties because they can be iterated & copied in a `onBeforePrerender()` hook, e.g. `/examples/i18n/'
  // addComputedUrlProps(pageContext)
  return pageContext
}

async function callOnBeforePrerenderHook(globalContext: {
  _pageFilesAll: PageFile[]
  prerenderPageContexts: PageContext[]
}) {
  const pageFilesWithOnBeforePrerenderHook = globalContext._pageFilesAll.filter((p) => {
    assertExportNames(p)
    if (!p.exportNames?.includes('onBeforePrerender')) return false
    assertUsage(
      p.fileType !== '.page.client',
      `${p.filePath} (which is a \`.page.client.js\` file) has \`export { onBeforePrerender }\` but it is only allowed in \`.page.server.js\` or \`.page.js\` files`
    )
    assertUsage(
      p.isDefaultPageFile,
      `${p.filePath} has \`export { onBeforePrerender }\` but it is only allowed in \`_defaut.page.\` files`
    )
    return true
  })
  if (pageFilesWithOnBeforePrerenderHook.length === 0) {
    return
  }
  assertUsage(
    pageFilesWithOnBeforePrerenderHook.length === 1,
    'There can be only one `onBeforePrerender()` hook. If you need to be able to define several, open a new GitHub issue.'
  )
  await Promise.all(pageFilesWithOnBeforePrerenderHook.map((p) => p.loadFile?.()))
  const hooks = pageFilesWithOnBeforePrerenderHook.map((p) => {
    assert(p.fileExports)
    const { onBeforePrerender } = p.fileExports
    assert(onBeforePrerender)
    const hookFilePath = p.filePath
    return { hookFilePath, onBeforePrerender }
  })
  assert(hooks.length === 1)
  const hook = hooks[0]!
  const { onBeforePrerender, hookFilePath } = hook

  const msgPrefix = `\`export { onBeforePrerender }\` of ${hookFilePath}`

  assertUsage(isCallable(onBeforePrerender), `${msgPrefix} should be a function.`)

  globalContext.prerenderPageContexts.forEach((pageContext) => {
    Object.defineProperty(pageContext, 'url', {
      get() {
        assertWarning(
          false,
          msgPrefix +
            ' uses `pageContext.url` but it should use `pageContext.urlOriginal` instead. (See https://vite-plugin-ssr.com/migration/0.4.23 for more information.)',
          { onlyOnce: true }
        )
        return pageContext.urlOriginal
      },
      enumerable: false,
      configurable: true
    })
    assert(hasPropertyGetter(pageContext, 'url'))
    assert(pageContext.urlOriginal)
  })

  const result = await callHookWithTimeout(() => onBeforePrerender(globalContext), 'onBeforePrerender', hookFilePath)
  if (result === null || result === undefined) {
    return
  }
  const errPrefix = `The \`onBeforePrerender()\` hook exported by \`${hookFilePath}\``
  assertUsage(
    isObjectWithKeys(result, ['globalContext'] as const) && hasProp(result, 'globalContext'),
    `${errPrefix} should return \`null\`, \`undefined\`, or a plain JavaScript object \`{ globalContext: { /* ... */ } }\`.`
  )
  const globalContextAddedum = result.globalContext
  assertUsage(
    isPlainObject(globalContextAddedum),
    `${errPrefix} returned \`{ globalContext }\` but \`globalContext\` should be a plain JavaScript object.`
  )
  objectAssign(globalContext, globalContextAddedum)

  globalContext.prerenderPageContexts.forEach((pageContext: PageContext & { url?: string }) => {
    if (pageContext.url && !hasPropertyGetter(pageContext, 'url')) {
      assertWarning(
        false,
        msgPrefix +
          ' provided `pageContext.url` but it should provide `pageContext.urlOriginal` instead. (See https://vite-plugin-ssr.com/migration/0.4.23 for more information.)',
        { onlyOnce: true }
      )
      pageContext.urlOriginal = pageContext.url
    }
    delete pageContext.url
  })
}

async function routeAndPrerender(
  globalContext: GlobalPrerenderingContext & { prerenderPageContexts: PageContext[] },
  htmlFiles: HtmlFile[],
  prerenderPageIds: PrerenderedPageIds,
  concurrencyLimit: PLimit
) {
  // Route all URLs
  await Promise.all(
    globalContext.prerenderPageContexts.map((pageContext) =>
      concurrencyLimit(async () => {
        const { urlOriginal, _prerenderHookFile: prerenderHookFile } = pageContext
        assert(urlOriginal)
        const routeResult = await route(pageContext)
        assert(
          hasProp(routeResult.pageContextAddendum, '_pageId', 'null') ||
            hasProp(routeResult.pageContextAddendum, '_pageId', 'string')
        )
        if (routeResult.pageContextAddendum._pageId === null) {
          if (prerenderHookFile === null) {
            // `prerenderHookFile` is `null` when the URL was deduced by the Filesytem Routing of `.page.js` files. The `onBeforeRoute()` can override Filesystem Routing; it is therefore expected that the deduced URL may not match any page.
            assert(routeResult.pageContextAddendum._routingProvidedByOnBeforeRouteHook)
            // Abort since the URL doesn't correspond to any page
            return
          } else {
            assert(prerenderHookFile)
            assertUsage(
              false,
              `Your \`prerender()\` hook defined in \`${prerenderHookFile}\ returns an URL \`${urlOriginal}\` that doesn't match any page route. Make sure the URLs your return in your \`prerender()\` hooks always match the URL of a page.`
            )
          }
        }

        assert(routeResult.pageContextAddendum._pageId)
        objectAssign(pageContext, routeResult.pageContextAddendum)
        const { _pageId: pageId } = pageContext

        const pageFilesData = await loadPageFilesServer({
          ...globalContext,
          urlOriginal,
          _pageId: pageId,
          _routeMatches: pageContext._routeMatches
        })
        objectAssign(pageContext, pageFilesData)

        objectAssign(pageContext, { is404: null })

        const { documentHtml, pageContextSerialized } = await prerenderPage(pageContext)
        htmlFiles.push({
          urlOriginal,
          pageContext,
          htmlString: documentHtml,
          pageContextSerialized,
          doNotCreateExtraDirectory: globalContext._noExtraDir,
          pageId
        })
        prerenderPageIds[pageId] = pageContext
      })
    )
  )
}

function warnContradictoryNoPrerenderList(
  prerenderPageIds: Record<string, { urlOriginal: string; _prerenderHookFile: string | null }>,
  doNotPrerenderList: DoNotPrerenderList
) {
  Object.entries(prerenderPageIds).forEach(([pageId, { urlOriginal, _prerenderHookFile }]) => {
    const doNotPrerenderListHit = doNotPrerenderList.find((p) => p.pageId === pageId)
    if (doNotPrerenderListHit) {
      assert(_prerenderHookFile)
      assertUsage(
        false,
        `Your \`prerender()\` hook defined in ${_prerenderHookFile} returns the URL \`${urlOriginal}\` which matches the page with \`${doNotPrerenderListHit?.pageFilePath}#doNotPrerender === true\`. This is contradictory: either don't set \`doNotPrerender\` or remove the URL from the list of URLs to be pre-rendered.`
      )
    }
  })
}

function warnMissingPages(
  prerenderPageIds: Record<string, unknown>,
  doNotPrerenderList: DoNotPrerenderList,
  globalContext: { _allPageIds: string[] },
  partial: boolean
) {
  globalContext._allPageIds
    .filter((pageId) => !prerenderPageIds[pageId])
    .filter((pageId) => !doNotPrerenderList.find((p) => p.pageId === pageId))
    .filter((pageId) => !isErrorPageId(pageId))
    .forEach((pageId) => {
      assertWarning(
        partial,
        `Could not pre-render page \`${pageId}.page.*\` because it has a non-static route, and no \`prerender()\` hook returned (an) URL(s) matching the page's route. Either use a \`prerender()\` hook to pre-render the page, or use the \`--partial\` option to suppress this warning.`,
        { onlyOnce: true }
      )
    })
}

async function prerender404Page(htmlFiles: HtmlFile[], globalContext: GlobalPrerenderingContext) {
  if (!htmlFiles.find(({ urlOriginal }) => urlOriginal === '/404')) {
    const result = await renderStatic404Page(globalContext)
    if (result) {
      const urlOriginal = '/404'
      const { documentHtml, pageContext } = result
      htmlFiles.push({
        urlOriginal,
        pageContext,
        htmlString: documentHtml,
        pageContextSerialized: null,
        doNotCreateExtraDirectory: true,
        pageId: null
      })
    }
  }
}

async function writeHtmlFile(
  { urlOriginal, pageContext, htmlString, pageContextSerialized, doNotCreateExtraDirectory, pageId }: HtmlFile,
  root: string,
  outDirClient: string,
  doNotPrerenderList: DoNotPrerenderList,
  concurrencyLimit: PLimit,
  onPagePrerender: Function | undefined,
  logLevel: 'warn' | 'info'
) {
  assert(urlOriginal.startsWith('/'))
  assert(!doNotPrerenderList.find((p) => p.pageId === pageId))

  const writeJobs = [
    write(
      urlOriginal,
      pageContext,
      '.html',
      htmlString,
      root,
      outDirClient,
      doNotCreateExtraDirectory,
      concurrencyLimit,
      onPagePrerender,
      logLevel
    )
  ]
  if (pageContextSerialized !== null) {
    writeJobs.push(
      write(
        urlOriginal,
        pageContext,
        '.pageContext.json',
        pageContextSerialized,
        root,
        outDirClient,
        doNotCreateExtraDirectory,
        concurrencyLimit,
        onPagePrerender,
        logLevel
      )
    )
  }
  await Promise.all(writeJobs)
}

function write(
  urlOriginal: string,
  pageContext: Record<string, unknown>,
  fileExtension: '.html' | '.pageContext.json',
  fileContent: string,
  root: string,
  outDirClient: string,
  doNotCreateExtraDirectory: boolean,
  concurrencyLimit: PLimit,
  onPagePrerender: Function | undefined,
  logLevel: 'info' | 'warn'
) {
  return concurrencyLimit(async () => {
    let fileUrl: string
    if (fileExtension === '.html') {
      fileUrl = urlToFile(urlOriginal, '.html', doNotCreateExtraDirectory)
    } else {
      fileUrl = getPageContextRequestUrl(urlOriginal)
    }

    assertPosixPath(fileUrl)
    assert(fileUrl.startsWith('/'))
    const filePathRelative = fileUrl.slice(1)
    assert(!filePathRelative.startsWith('/'))
    assertPosixPath(outDirClient)
    assertPosixPath(filePathRelative)
    const filePath = path.posix.join(outDirClient, filePathRelative)
    if (onPagePrerender) {
      const prerenderPageContext = {}
      objectAssign(prerenderPageContext, pageContext)
      objectAssign(prerenderPageContext, {
        _prerenderResult: {
          filePath,
          fileContent
        }
      })
      await onPagePrerender(prerenderPageContext)
    } else {
      const { promises } = require('fs')
      const { writeFile, mkdir } = promises
      await mkdir(path.posix.dirname(filePath), { recursive: true })
      await writeFile(filePath, fileContent)
      if (logLevel === 'info') {
        assertPosixPath(root)
        assertPosixPath(outDirClient)
        let outDirClientRelative = path.posix.relative(root, outDirClient)
        if (!outDirClientRelative.endsWith('/')) {
          outDirClientRelative = outDirClientRelative + '/'
        }
        console.log(`${gray(outDirClientRelative)}${blue(filePathRelative)}`)
      }
    }
  })
}

function normalizePrerenderResult(
  prerenderResult: unknown,
  prerenderHookFile: string
): { url: string; pageContext: null | Record<string, unknown> }[] {
  if (Array.isArray(prerenderResult)) {
    return prerenderResult.map(normalize)
  } else {
    return [normalize(prerenderResult)]
  }

  function normalize(prerenderElement: unknown): { url: string; pageContext: null | Record<string, unknown> } {
    if (typeof prerenderElement === 'string') return { url: prerenderElement, pageContext: null }

    const errMsg1 = `The \`prerender()\` hook defined in \`${prerenderHookFile}\` returned an invalid value`
    const errMsg2 =
      'Make sure your `prerender()` hook returns an object `{ url, pageContext }` or an array of such objects.'
    assertUsage(isPlainObject(prerenderElement), `${errMsg1}. ${errMsg2}`)
    assertUsage(hasProp(prerenderElement, 'url'), `${errMsg1}: \`url\` is missing. ${errMsg2}`)
    assertUsage(
      hasProp(prerenderElement, 'url', 'string'),
      `${errMsg1}: \`url\` should be a string (but we got \`typeof url === "${typeof prerenderElement.url}"\`).`
    )
    assertUsage(
      prerenderElement.url.startsWith('/'),
      `${errMsg1}: the \`url\` with value \`${prerenderElement.url}\` doesn't start with \`/\`. Make sure each URL starts with \`/\`.`
    )
    Object.keys(prerenderElement).forEach((key) => {
      assertUsage(key === 'url' || key === 'pageContext', `${errMsg1}: unexpected object key \`${key}\` ${errMsg2}`)
    })
    if (!hasProp(prerenderElement, 'pageContext')) {
      prerenderElement['pageContext'] = null
    }
    assertUsage(
      hasProp(prerenderElement, 'pageContext', 'object'),
      `The \`prerender()\` hook exported by ${prerenderHookFile} returned an invalid \`pageContext\` value: make sure \`pageContext\` is a plain JavaScript object.`
    )
    return prerenderElement
  }
}

function checkOutdatedOptions(options: {
  partial?: unknown
  noExtraDir?: unknown
  base?: unknown
  root?: unknown
  configFile?: unknown
  outDir?: unknown
  parallel?: number
}) {
  assertUsage(
    options.root === undefined,
    'Option `prerender({ root })` deprecated: set `prerender({ viteConfig: { root }})` instead.'
  )
  assertUsage(
    options.configFile === undefined,
    'Option `prerender({ configFile })` deprecated: set `prerender({ viteConfig: { configFile }})` instead.'
  )
  ;(['noExtraDir', 'partial', 'parallel'] as const).forEach((prop) => {
    assertUsage(
      options[prop] === undefined,
      `[prerender()] Option \`${prop}\` is deprecated. Define \`${prop}\` in \`vite.config.js\` instead. See https://vite-plugin-ssr.com/prerender-config`
    )
  })
  ;(['base', 'outDir'] as const).forEach((prop) => {
    assertWarning(
      options[prop] === undefined,
      `[prerender()] Option \`${prop}\` is outdated and has no effect (vite-plugin-ssr now automatically determines \`${prop}\`)`,
      {
        onlyOnce: true
      }
    )
  })
}

function disableReactStreaming() {
  let mod: any
  try {
    mod = loadModuleAtRuntime('react-streaming/server')
  } catch {
    return
  }
  const { disable } = mod
  disable()
}

function assertLoadedConfig(
  viteConfig: { plugins: readonly { name: string }[]; configFile?: string },
  options: { viteConfig?: InlineConfig }
) {
  if (viteConfig.plugins.some((p) => p.name.startsWith('vite-plugin-ssr'))) {
    return
  }
  const { configFile } = viteConfig
  if (configFile) {
    assertUsage(false, `${configFile} is missing vite-plugin-ssr. Add vite-plugin-ssr to \`${configFile}\`.`)
  } else {
    if (!options.viteConfig) {
      assertUsage(
        false,
        `[prerender()] No \`vite.config.js\` file found at \`${process.cwd()}\`. Use the option \`prerender({ viteConfig })\`.`
      )
    } else {
      assertUsage(false, '[prerender()] The Vite config `prerender({ viteConfig })` is missing vite-plugin-ssr.')
    }
  }
}
