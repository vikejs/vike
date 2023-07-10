export { prerenderFromAPI }
export { prerenderFromCLI }
export { prerenderFromAutoFullBuild }
export { prerenderForceExit }
export type { PrerenderOptions }

import '../runtime/page-files/setup'
import path from 'path'
import { route, type PageRoutes } from '../../shared/route'
import {
  assert,
  assertUsage,
  assertWarning,
  hasProp,
  projectInfo,
  objectAssign,
  isObjectWithKeys,
  isCallable,
  getOutDirs_prerender,
  loadModuleAtRuntime,
  hasPropertyGetter,
  assertPosixPath,
  urlToFile,
  executeHook,
  isPlainObject,
  setNodeEnvToProduction
} from './utils'
import { pLimit, PLimit } from '../../utils/pLimit'
import {
  getRenderContext,
  loadPageFilesServer,
  prerenderPageContext,
  type RenderContext,
  prerender404Page,
  initPageContext
} from '../runtime/renderPage/renderPageAlreadyRouted'
import pc from '@brillout/picocolors'
import { cpus } from 'os'
import type { PageFile } from '../../shared/getPageFiles'
import { getGlobalContext, initGlobalContext } from '../runtime/globalContext'
import { resolveConfig } from 'vite'
import { getConfigVps } from '../shared/getConfigVps'
import type { InlineConfig } from 'vite'
import { getPageFilesServerSide } from '../../shared/getPageFiles'
import { getPageContextRequestUrl } from '../../shared/getPageContextRequestUrl'
import { getUrlFromRouteString } from '../../shared/route/resolveRouteString'
import type { PageConfig, PageConfigGlobal } from '../../shared/page-configs/PageConfig'
import { getCodeFilePath, getConfigValue } from '../../shared/page-configs/utils'
import { loadPageCode } from '../../shared/page-configs/loadPageCode'
import { isErrorPage } from '../../shared/error-page'
import { addComputedUrlProps } from '../../shared/addComputedUrlProps'
import { assertPathIsFilesystemAbsolute } from '../../utils/assertPathIsFilesystemAbsolute'
import type { OnBeforeRouteHook } from '../../shared/route/executeOnBeforeRouteHook'

type HtmlFile = {
  urlOriginal: string
  pageContext: Record<string, unknown>
  htmlString: string
  pageContextSerialized: string | null
  doNotCreateExtraDirectory: boolean
  pageId: string | null
}

type DoNotPrerenderList = ({ pageId: string; setByConfigFile: string } & (
  | {
      // TODO/v1-release: remove 0.4 case
      setByConfigName: 'doNotPrerender'
      setByConfigValue: true
    }
  | {
      setByConfigName: 'prerender'
      setByConfigValue: false
    }
))[]
type ProvidedByHook = null | {
  hookFilePath: string
  hookName: 'onBeforePrerenderStart' | 'prerender'
}
type TransformerHook = {
  hookFilePath: string
  hookName: 'onPrerenderStart' | 'onBeforePrerender'
}
type PrerenderedPageIds = Record<string, { urlOriginal: string; _providedByHook: ProvidedByHook }>

type PrerenderContext = {
  pageContexts: PageContext[]
  pageContextInit: Record<string, unknown> | null
  _noExtraDir: boolean
}

type PageContext = {
  urlOriginal: string
  _urlOriginalBeforeHook?: string
  _urlOriginalModifiedByHook?: TransformerHook
  _providedByHook: ProvidedByHook
  _baseServer: string
  _urlHandler: null
  _baseAssets: null | string
  _includeAssetsImportedByServer: boolean
  _pageContextAlreadyProvidedByOnPrerenderHook?: true
  // TODO: use GlobalNodeContext instead
  _allPageIds: string[]
  _pageFilesAll: PageFile[]
  _pageConfigs: PageConfig[]
  _pageConfigGlobal: PageConfigGlobal
  _pageRoutes: PageRoutes
  _onBeforeRouteHook: OnBeforeRouteHook | null
}

type PrerenderOptions = {
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

  // TODO/v1-release: remove
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
}

async function prerenderFromAPI(options: PrerenderOptions = {}): Promise<void> {
  await runPrerender(options, 'prerender()')
}
async function prerenderFromCLI(options: PrerenderOptions): Promise<void> {
  await runPrerender(options, '$ vite-plugin-ssr prerender')
}
async function prerenderFromAutoFullBuild(options: PrerenderOptions): Promise<void> {
  await runPrerender(options, null)
}
async function runPrerender(
  options: PrerenderOptions,
  manuallyTriggered: null | '$ vite-plugin-ssr prerender' | 'prerender()'
): Promise<void> {
  checkOutdatedOptions(options)

  const logLevel = !!options.onPagePrerender ? 'warn' : 'info'
  if (logLevel === 'info') {
    console.log(`${pc.cyan(`vite-plugin-ssr v${projectInfo.projectVersion}`)} ${pc.green('pre-rendering HTML...')}`)
  }

  setNodeEnvToProduction()

  disableReactStreaming()

  const viteConfig = await resolveConfig(options.viteConfig || {}, 'vite-plugin-ssr pre-rendering' as any, 'production')
  assertLoadedConfig(viteConfig, options)
  const configVps = await getConfigVps(viteConfig)

  const { outDirClient, outDirRoot } = getOutDirs_prerender(viteConfig)
  const { root } = viteConfig
  const prerenderConfig = configVps.prerender
  if (!prerenderConfig) {
    assert(manuallyTriggered)
    assertWarning(
      prerenderConfig,
      `You're executing \`${manuallyTriggered}\` but the config \`prerender\` isn't set to true`,
      {
        onlyOnce: true
      }
    )
  }
  const { partial = false, noExtraDir = false, parallel = true } = prerenderConfig || {}

  const concurrencyLimit = pLimit(
    parallel === false || parallel === 0 ? 1 : parallel === true || parallel === undefined ? cpus().length : parallel
  )

  assertPathIsFilesystemAbsolute(outDirRoot) // Needed for loadServerBuild(outDir) of @brillout/vite-plugin-import-build
  await initGlobalContext(true, outDirRoot)
  const renderContext = await getRenderContext()
  renderContext.pageFilesAll.forEach(assertExportNames)

  const prerenderContext = {}
  objectAssign(prerenderContext, {
    _urlHandler: null,
    _noExtraDir: noExtraDir ?? false,
    pageContexts: [] as PageContext[],
    pageContextInit: options.pageContextInit ?? null
  })

  const doNotPrerenderList: DoNotPrerenderList = []
  await collectDoNoPrerenderList(renderContext, doNotPrerenderList, concurrencyLimit)

  await callOnBeforePrerenderStartHooks(prerenderContext, renderContext, concurrencyLimit)

  await handlePagesWithStaticRoutes(prerenderContext, renderContext, doNotPrerenderList, concurrencyLimit)

  await callOnPrerenderStartHook(prerenderContext, renderContext)

  const prerenderPageIds: PrerenderedPageIds = {}
  const htmlFiles: HtmlFile[] = []
  await routeAndPrerender(prerenderContext, htmlFiles, prerenderPageIds, concurrencyLimit)

  warnContradictoryNoPrerenderList(prerenderPageIds, doNotPrerenderList)

  await prerender404(htmlFiles, renderContext, prerenderContext)

  if (logLevel === 'info') {
    console.log(`${pc.green(`✓`)} ${htmlFiles.length} HTML documents pre-rendered.`)
  }

  await Promise.all(
    htmlFiles.map((htmlFile) =>
      writeHtmlFile(htmlFile, root, outDirClient, concurrencyLimit, options.onPagePrerender, logLevel)
    )
  )

  warnMissingPages(prerenderPageIds, doNotPrerenderList, renderContext, partial)
}

async function collectDoNoPrerenderList(
  renderContext: RenderContext,
  doNotPrerenderList: DoNotPrerenderList,
  concurrencyLimit: PLimit
) {
  renderContext.pageConfigs.forEach((pageConfig) => {
    const prerenderConfigValue = getConfigValue(pageConfig, 'prerender', 'boolean')
    if (prerenderConfigValue === false) {
      const configElement = pageConfig.configElements.prerender
      assert(configElement)
      assert(configElement.configValue === false)
      doNotPrerenderList.push({
        pageId: pageConfig.pageId,
        setByConfigName: 'prerender',
        setByConfigValue: false,
        setByConfigFile: configElement.configDefinedByFile
      })
    }
  })

  await Promise.all(
    renderContext.pageFilesAll
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
  renderContext.allPageIds.forEach((pageId) => {
    const pageFilesServerSide = getPageFilesServerSide(renderContext.pageFilesAll, pageId)
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
        doNotPrerenderList.push({
          pageId,
          setByConfigFile: p.filePath,
          setByConfigName: 'doNotPrerender',
          setByConfigValue: doNotPrerender
        })
      }
    }
  })
}

function assertExportNames(pageFile: PageFile) {
  const { exportNames, fileType } = pageFile
  assert(exportNames || fileType === '.page.route' || fileType === '.css', pageFile.filePath)
}

async function callOnBeforePrerenderStartHooks(
  prerenderContext: PrerenderContext,
  renderContext: RenderContext,
  concurrencyLimit: PLimit
) {
  const onBeforePrerenderStartHooks: {
    hookFn: Function
    // prettier-ignore
    hookName:
      // 0.4 design
      | 'prerender'
      // V1 design
      | 'onBeforePrerenderStart'
    hookFilePath: string
  }[] = []

  // V1 design
  await Promise.all(
    renderContext.pageConfigs.map((pageConfig) =>
      concurrencyLimit(async () => {
        if (!pageConfig.configElements.onBeforePrerenderStart) return
        const codeFilePath = getCodeFilePath(pageConfig, 'onBeforePrerenderStart')
        assert(codeFilePath)
        const pageConfigLoaded = await loadPageCode(pageConfig, false)
        const hookFn = pageConfigLoaded.configValues.onBeforePrerenderStart
        assert(hookFn)
        assertUsage(
          isCallable(hookFn),
          `The onBeforePrerenderStart() hook defined by ${codeFilePath} should be a function`
        )
        onBeforePrerenderStartHooks.push({
          hookFn,
          hookName: 'onBeforePrerenderStart',
          hookFilePath: codeFilePath
        })
      })
    )
  )

  // 0.4 design
  await Promise.all(
    renderContext.pageFilesAll
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

          const hookFn = p.fileExports?.prerender
          if (!hookFn) return
          assertUsage(isCallable(hookFn), `\`export { prerender }\` of ${p.filePath} should be a function.`)
          const hookFilePath = p.filePath
          assert(hookFilePath)
          onBeforePrerenderStartHooks.push({
            hookFn,
            hookName: 'prerender',
            hookFilePath
          })
        })
      )
  )

  await Promise.all(
    onBeforePrerenderStartHooks.map(({ hookFn, hookName, hookFilePath }) =>
      concurrencyLimit(async () => {
        const prerenderResult: unknown = await hookFn()
        const result = normalizeOnPrerenderHookResult(prerenderResult, hookFilePath, hookName)
        result.forEach(({ url, pageContext }) => {
          {
            const pageContextFound: PageContext | undefined = prerenderContext.pageContexts.find((pageContext) =>
              isSameUrl(pageContext.urlOriginal, url)
            )
            if (pageContextFound) {
              assert(pageContextFound._providedByHook)
              const providedTwice =
                hookFilePath === pageContextFound._providedByHook.hookFilePath
                  ? `twice by the ${hookName}() hook (${hookFilePath})`
                  : `twice: by the ${hookName}() hook (${hookFilePath}) as well as by the hook ${pageContextFound._providedByHook.hookFilePath}() (${pageContextFound._providedByHook.hookName})`
              assertUsage(
                false,
                `URL '${url}' provided ${providedTwice}. Make sure to provide the URL only once instead.`
              )
            }
          }
          const pageContextNew = createPageContext(url, renderContext, prerenderContext)
          objectAssign(pageContextNew, {
            _providedByHook: {
              hookFilePath,
              hookName
            }
          })
          prerenderContext.pageContexts.push(pageContextNew)
          if (pageContext) {
            objectAssign(pageContextNew, {
              _pageContextAlreadyProvidedByOnPrerenderHook: true,
              ...pageContext
            })
          }
        })
      })
    )
  )
}

async function handlePagesWithStaticRoutes(
  prerenderContext: PrerenderContext,
  renderContext: RenderContext,
  doNotPrerenderList: DoNotPrerenderList,
  concurrencyLimit: PLimit
) {
  // Pre-render pages with a static route
  await Promise.all(
    renderContext.pageRoutes.map((pageRoute) =>
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

        // Already included in a onBeforePrerenderStart() hook
        if (prerenderContext.pageContexts.find((pageContext) => isSameUrl(pageContext.urlOriginal, urlOriginal))) {
          return
        }

        const routeParams = {}
        const pageContext = createPageContext(urlOriginal, renderContext, prerenderContext)
        objectAssign(pageContext, {
          _providedByHook: null,
          routeParams,
          _pageId: pageId,
          _routeMatches: [
            {
              pageId,
              routeType: pageRoute.routeType,
              routeString: urlOriginal,
              routeParams
            }
          ]
        })
        objectAssign(pageContext, await loadPageFilesServer(pageContext))

        prerenderContext.pageContexts.push(pageContext)
      })
    )
  )
}

function createPageContext(urlOriginal: string, renderContext: RenderContext, prerenderContext: PrerenderContext) {
  const pageContext = {}
  const pageContextInit = {
    urlOriginal,
    ...prerenderContext.pageContextInit
  }
  {
    const pageContextInitAddendum = initPageContext(pageContextInit, renderContext)
    objectAssign(pageContext, pageContextInitAddendum)
  }
  objectAssign(pageContext, {
    _urlHandler: null,
    _noExtraDir: prerenderContext._noExtraDir,
    _prerenderContext: prerenderContext
  })
  addComputedUrlProps(
    pageContext,
    // We set `enumerable` to `false` to avoid computed URL properties from being iterated & copied in a onPrerenderStart() hook, e.g. /examples/i18n/
    false
  )
  return pageContext
}

async function callOnPrerenderStartHook(
  prerenderContext: {
    pageContexts: PageContext[]
  },
  renderContext: RenderContext
) {
  let onPrerenderStartHook:
    | undefined
    | {
        hookFn: unknown
        hookFilePath: string
        // prettier-ignore
        hookName:
          // V1 design
          'onPrerenderStart' |
          // Old design
          'onBeforePrerender'
      }

  // V1 design
  if (renderContext.pageConfigs.length > 0) {
    const configElement = renderContext.pageConfigGlobal.onPrerenderStart
    if (configElement) {
      const hookFn = configElement.configValue
      const hookFilePath = configElement.codeFilePath
      assert(hookFilePath)
      if (hookFn) {
        onPrerenderStartHook = {
          hookFn,
          hookName: 'onPrerenderStart',
          hookFilePath
        }
      }
    }
  }

  // Old design
  // TODO/v1-release: remove
  if (renderContext.pageConfigs.length === 0) {
    const pageFilesWithOnBeforePrerenderHook = renderContext.pageFilesAll.filter((p) => {
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
    onPrerenderStartHook = {
      hookFn: hook.onBeforePrerender,
      hookFilePath: hook.hookFilePath,
      hookName: 'onBeforePrerender'
    }
  }

  if (!onPrerenderStartHook) {
    return
  }

  const msgPrefix =
    `The ${onPrerenderStartHook.hookName}() hook defined by ${onPrerenderStartHook.hookFilePath}` as const

  const { hookFn, hookFilePath, hookName } = onPrerenderStartHook
  assertUsage(isCallable(hookFn), `${msgPrefix} should be a function.`)

  prerenderContext.pageContexts.forEach((pageContext) => {
    Object.defineProperty(pageContext, 'url', {
      // TODO/v1-release: remove warning
      get() {
        assertWarning(
          false,
          msgPrefix +
            ' uses pageContext.url but it should use pageContext.urlOriginal instead, see https://vite-plugin-ssr.com/migration/0.4.23',
          { showStackTrace: true, onlyOnce: true }
        )
        return pageContext.urlOriginal
      },
      enumerable: false,
      configurable: true
    })
    assert(hasPropertyGetter(pageContext, 'url'))
    assert(pageContext.urlOriginal)
    pageContext._urlOriginalBeforeHook = pageContext.urlOriginal
  })

  const docLink = 'https://vite-plugin-ssr.com/i18n#pre-rendering'

  let result: unknown = await executeHook(
    () =>
      hookFn({
        pageContexts: prerenderContext.pageContexts,
        // TODO/v1-release: remove warning
        get prerenderPageContexts() {
          assertWarning(false, `prerenderPageContexts has been renamed pageContexts, see ${docLink}`, {
            showStackTrace: true,
            onlyOnce: true
          })
          return prerenderContext.pageContexts
        }
      }),
    hookName,
    hookFilePath
  )
  if (result === null || result === undefined) {
    return
  }

  const errPrefix = `The ${hookName}() hook exported by ${hookFilePath}`
  const rightUsage = `${errPrefix} should return \`null\`, \`undefined\`, or \`{ prerenderContext: { pageContexts } }\`.`

  // TODO/v1-release: remove
  if (hasProp(result, 'globalContext')) {
    assertUsage(
      isObjectWithKeys(result, ['globalContext'] as const) &&
        hasProp(result, 'globalContext', 'object') &&
        hasProp(result.globalContext, 'prerenderPageContexts', 'array'),
      rightUsage
    )
    assertWarning(
      false,
      `${errPrefix} returns \`{ globalContext: { prerenderPageContexts } }\` but the return value has been renamed to \`{ prerenderContext: { pageContexts } }\`, see ${docLink}`,
      { onlyOnce: true }
    )
    result = {
      prerenderContext: {
        pageContexts: result.globalContext.prerenderPageContexts
      }
    }
  }

  assertUsage(
    isObjectWithKeys(result, ['prerenderContext'] as const) &&
      hasProp(result, 'prerenderContext', 'object') &&
      hasProp(result.prerenderContext, 'pageContexts', 'array'),
    rightUsage
  )
  prerenderContext.pageContexts = result.prerenderContext.pageContexts as PageContext[]

  prerenderContext.pageContexts.forEach((pageContext: PageContext & { url?: string }) => {
    if (!hasPropertyGetter(pageContext, 'url') && pageContext.url) {
      assertWarning(
        false,
        msgPrefix +
          ' provided pageContext.url but it should provide pageContext.urlOriginal instead, see https://vite-plugin-ssr.com/migration/0.4.23',
        { onlyOnce: true }
      )
      pageContext.urlOriginal = pageContext.url
    }
    delete pageContext.url
  })

  prerenderContext.pageContexts.forEach((pageContext: PageContext) => {
    if (pageContext.urlOriginal !== pageContext._urlOriginalBeforeHook) {
      pageContext._urlOriginalModifiedByHook = {
        hookFilePath,
        hookName
      }
    }
  })
}

async function routeAndPrerender(
  prerenderContext: PrerenderContext,
  htmlFiles: HtmlFile[],
  prerenderPageIds: PrerenderedPageIds,
  concurrencyLimit: PLimit
) {
  const globalContext = getGlobalContext()
  assert(globalContext.isPrerendering)

  // Route all URLs
  await Promise.all(
    prerenderContext.pageContexts.map((pageContext) =>
      concurrencyLimit(async () => {
        const { urlOriginal } = pageContext
        assert(urlOriginal)
        const routeResult = await route(pageContext)
        assert(
          hasProp(routeResult.pageContextAddendum, '_pageId', 'null') ||
            hasProp(routeResult.pageContextAddendum, '_pageId', 'string')
        )
        if (routeResult.pageContextAddendum._pageId === null) {
          let hookName: string | undefined
          let hookFilePath: string | undefined
          if (pageContext._providedByHook) {
            hookName = pageContext._providedByHook.hookName
            hookFilePath = pageContext._providedByHook.hookFilePath
          } else if (pageContext._urlOriginalModifiedByHook) {
            hookName = pageContext._urlOriginalModifiedByHook.hookName
            hookFilePath = pageContext._urlOriginalModifiedByHook.hookFilePath
          }
          if (hookName) {
            assert(hookFilePath)
            assertUsage(
              false,
              `The ${hookName}() hook defined by ${hookFilePath} returns a URL '${urlOriginal}' that doesn't match any of your page routes. Make sure that the URLs returned by ${hookName}() always match the route of a page.`
            )
          } else {
            // `prerenderHookFile` is `null` when the URL was deduced by the Filesytem Routing of `.page.js` files. The `onBeforeRoute()` can override Filesystem Routing; it is therefore expected that the deduced URL may not match any page.
            assert(routeResult.pageContextAddendum._routingProvidedByOnBeforeRouteHook)
            // Abort since the URL doesn't correspond to any page
            return
          }
        }

        assert(routeResult.pageContextAddendum._pageId)
        objectAssign(pageContext, routeResult.pageContextAddendum)
        const { _pageId: pageId } = pageContext

        const pageFilesData = await loadPageFilesServer(pageContext)
        objectAssign(pageContext, pageFilesData)

        let usesClientRouter: boolean
        {
          if (pageContext._pageConfigs.length > 0) {
            const pageConfig = pageContext._pageConfigs.find((p) => p.pageId === pageId)
            assert(pageConfig)
            usesClientRouter = getConfigValue(pageConfig, 'clientRouting', 'boolean') ?? false
          } else {
            usesClientRouter = globalContext.pluginManifest.usesClientRouter
          }
        }

        objectAssign(pageContext, {
          is404: null,
          _httpRequestId: null,
          _usesClientRouter: usesClientRouter
        })

        const { documentHtml, pageContextSerialized } = await prerenderPageContext(pageContext)
        htmlFiles.push({
          urlOriginal,
          pageContext,
          htmlString: documentHtml,
          pageContextSerialized,
          doNotCreateExtraDirectory: prerenderContext._noExtraDir,
          pageId
        })
        prerenderPageIds[pageId] = pageContext
      })
    )
  )
}

function warnContradictoryNoPrerenderList(
  prerenderPageIds: Record<string, { urlOriginal: string; _providedByHook: ProvidedByHook }>,
  doNotPrerenderList: DoNotPrerenderList
) {
  Object.entries(prerenderPageIds).forEach(([pageId, pageContext]) => {
    const doNotPrerenderListEntry = doNotPrerenderList.find((p) => p.pageId === pageId)
    const { urlOriginal, _providedByHook: providedByHook } = pageContext
    {
      const isContradictory = !!doNotPrerenderListEntry && providedByHook
      if (!isContradictory) return
    }
    const { setByConfigName, setByConfigValue, setByConfigFile } = doNotPrerenderListEntry
    assertWarning(
      false,
      `The ${providedByHook.hookName}() hook defined by ${providedByHook.hookFilePath} returns the URL '${urlOriginal}', while ${setByConfigFile} sets the config '${setByConfigName}' to ${setByConfigValue}. This is contradictory: either don't set the config '${setByConfigName}' to ${setByConfigValue} or remove the URL '${urlOriginal}' from the list of URLs to be pre-rendered.`,
      { onlyOnce: true }
    )
  })
}

function warnMissingPages(
  prerenderPageIds: Record<string, unknown>,
  doNotPrerenderList: DoNotPrerenderList,
  renderContext: RenderContext,
  partial: boolean
) {
  const isV1 = renderContext.pageConfigs.length > 0
  const hookName = isV1 ? 'prerender' : 'onBeforePrerenderStart'
  const getPageAt = isV1 ? (pageId: string) => `defined at ${pageId}` : (pageId: string) => `\`${pageId}.page.*\``

  renderContext.allPageIds
    .filter((pageId) => !prerenderPageIds[pageId])
    .filter((pageId) => !doNotPrerenderList.find((p) => p.pageId === pageId))
    .filter((pageId) => !isErrorPage(pageId, renderContext.pageConfigs))
    .forEach((pageId) => {
      const pageAt = getPageAt(pageId)
      assertWarning(
        partial,
        `Cannot pre-render page ${pageAt} because it has a non-static route, and no ${hookName}() hook returned (an) URL(s) matching the page's route. Either use a ${hookName}() hook to pre-render the page, or use the option \`prerender.partial\` to suppress this warning, see https://vite-plugin-ssr.com/prerender-config`,
        { onlyOnce: true }
      )
    })
}

async function prerender404(htmlFiles: HtmlFile[], renderContext: RenderContext, prerenderContext: PrerenderContext) {
  if (!htmlFiles.find(({ urlOriginal }) => urlOriginal === '/404')) {
    const result = await prerender404Page(renderContext, prerenderContext.pageContextInit)
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
  { urlOriginal, pageContext, htmlString, pageContextSerialized, doNotCreateExtraDirectory }: HtmlFile,
  root: string,
  outDirClient: string,
  concurrencyLimit: PLimit,
  onPagePrerender: Function | undefined,
  logLevel: 'warn' | 'info'
) {
  assert(urlOriginal.startsWith('/'))

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
        console.log(`${pc.dim(outDirClientRelative)}${pc.blue(filePathRelative)}`)
      }
    }
  })
}

function normalizeOnPrerenderHookResult(
  prerenderResult: unknown,
  prerenderHookFile: string,
  hookName: 'prerender' | 'onBeforePrerenderStart'
): { url: string; pageContext: null | Record<string, unknown> }[] {
  if (Array.isArray(prerenderResult)) {
    return prerenderResult.map(normalize)
  } else {
    return [normalize(prerenderResult)]
  }

  function normalize(prerenderElement: unknown): { url: string; pageContext: null | Record<string, unknown> } {
    if (typeof prerenderElement === 'string') {
      prerenderElement = { url: prerenderElement, pageContext: null }
    }

    const errMsg1 = `The ${hookName}() hook defined by ${prerenderHookFile} returned` as const
    const errMsg2 = `${errMsg1} an invalid value` as const
    const errHint =
      `Make sure your ${hookName}() hook returns an object \`{ url, pageContext }\` or an array of such objects.` as const
    assertUsage(isPlainObject(prerenderElement), `${errMsg2}. ${errHint}`)
    assertUsage(hasProp(prerenderElement, 'url'), `${errMsg2}: \`url\` is missing. ${errHint}`)
    assertUsage(
      hasProp(prerenderElement, 'url', 'string'),
      `${errMsg2}: \`url\` should be a string (but \`typeof url === "${typeof prerenderElement.url}"\`).`
    )
    assertUsage(
      prerenderElement.url.startsWith('/'),
      `${errMsg1} a URL with an invalid value '${prerenderElement.url}' which doesn't start with '/'. Make sure each URL starts with '/'.`
    )
    Object.keys(prerenderElement).forEach((key) => {
      assertUsage(key === 'url' || key === 'pageContext', `${errMsg2}: unexpected object key \`${key}\`. ${errHint}`)
    })
    if (!hasProp(prerenderElement, 'pageContext')) {
      prerenderElement.pageContext = null
    } else if (!hasProp(prerenderElement, 'pageContext', 'null')) {
      assertUsage(
        hasProp(prerenderElement, 'pageContext', 'object'),
        `${errMsg1} an invalid \`pageContext\` value: make sure \`pageContext\` is an object.`
      )
      assertUsage(
        isPlainObject(prerenderElement.pageContext),
        `${errMsg1} an invalid \`pageContext\` object: make sure \`pageContext\` is a plain JavaScript object.`
      )
    }
    assert(hasProp(prerenderElement, 'pageContext', 'object') || hasProp(prerenderElement, 'pageContext', 'null'))
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
    'Option `prerender({ root })` deprecated: set `prerender({ viteConfig: { root }})` instead.',
    { showStackTrace: true }
  )
  assertUsage(
    options.configFile === undefined,
    'Option `prerender({ configFile })` deprecated: set `prerender({ viteConfig: { configFile }})` instead.',
    { showStackTrace: true }
  )
  ;(['noExtraDir', 'partial', 'parallel'] as const).forEach((prop) => {
    assertUsage(
      options[prop] === undefined,
      `[prerender()] Option \`${prop}\` is deprecated. Define \`${prop}\` in \`vite.config.js\` instead. See https://vite-plugin-ssr.com/prerender-config`,
      { showStackTrace: true }
    )
  })
  ;(['base', 'outDir'] as const).forEach((prop) => {
    assertWarning(
      options[prop] === undefined,
      `[prerender()] Option \`${prop}\` is outdated and has no effect (vite-plugin-ssr now automatically determines \`${prop}\`)`,
      {
        showStackTrace: true,
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
        `[prerender()] No \`vite.config.js\` file found at \`${process.cwd()}\`. Use the option \`prerender({ viteConfig })\`.`,
        { showStackTrace: true }
      )
    } else {
      assertUsage(false, '[prerender()] The Vite config `prerender({ viteConfig })` is missing vite-plugin-ssr.', {
        showStackTrace: true
      })
    }
  }
}

function isSameUrl(url1: string, url2: string) {
  return normalizeUrl(url1) === normalizeUrl(url2)
}
function normalizeUrl(url: string) {
  return '/' + url.split('/').filter(Boolean).join('/')
}

function prerenderForceExit() {
  // Force exit; known situations where pre-rendering is hanging:
  //  - https://github.com/brillout/vite-plugin-ssr/discussions/774#discussioncomment-5584551
  //  - https://github.com/brillout/vite-plugin-ssr/issues/807#issuecomment-1519010902
  process.exit(0)

  /* I guess there is no need to tell the user about it? Let's see if a user complains.
   * I don't known whether there is a way to call process.exit(0) only if needed, thus I'm not sure if there is a way to conditionally show a assertInfo().
  assertInfo(false, "Pre-rendering was forced exit. (Didn't gracefully exit because the event queue isn't empty. This is usally fine, see ...", { onlyOnce: false })
  */
}
