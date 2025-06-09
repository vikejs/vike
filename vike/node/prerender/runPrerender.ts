export { runPrerender }
export type { PrerenderOptions }
export type { PrerenderContextPublic }

// Failed attempt to run this file (i.e. pre-rendering) in a separate process: https://github.com/vikejs/vike/commit/48feda87012115b32a5c9701da354cb8c138dfd2
// - The issue is that prerenderContext needs to be serialized for being able to pass it from the child process to the parent process.
// - The prerenderContext is used by vike-vercel

import path from 'path'
import { route } from '../../shared/route/index.js'
import {
  assert,
  assertUsage,
  assertWarning,
  hasProp,
  objectAssign,
  isObjectWithKeys,
  isCallable,
  isPropertyGetter,
  assertPosixPath,
  urlToFile,
  isPlainObject,
  pLimit,
  PLimit,
  isArray,
  onSetupPrerender,
  PROJECT_VERSION,
  preservePropertyGetters,
  changeEnumerable
} from './utils.js'
import { prerenderPage } from '../runtime/renderPage/renderPageAlreadyRouted.js'
import { createPageContextServerSide } from '../runtime/renderPage/createPageContextServerSide.js'
import pc from '@brillout/picocolors'
import { cpus } from 'os'
import type { PageFile } from '../../shared/getPageFiles.js'
import {
  getGlobalContextServerInternal,
  type GlobalContextServerInternal,
  initGlobalContext_runPrerender,
  setGlobalContext_isPrerendering
} from '../runtime/globalContext.js'
import { resolveConfig as resolveViteConfig } from 'vite'
import { getPageFilesServerSide } from '../../shared/getPageFiles.js'
import { getPageContextRequestUrl } from '../../shared/getPageContextRequestUrl.js'
import { getUrlFromRouteString } from '../../shared/route/resolveRouteString.js'
import { getConfigValueRuntime } from '../../shared/page-configs/getConfigValueRuntime.js'
import { loadConfigValues } from '../../shared/page-configs/loadConfigValues.js'
import { getErrorPageId, isErrorPage } from '../../shared/error-page.js'
import { isAbortError } from '../../shared/route/abort.js'
import { loadPageConfigsLazyServerSide } from '../runtime/renderPage/loadPageConfigsLazyServerSide.js'
import {
  getHookFromPageConfig,
  getHookFromPageConfigGlobal,
  getHookTimeoutDefault,
  getHook_setIsPrerenderering
} from '../../shared/hooks/getHook.js'
import { noRouteMatch } from '../../shared/route/noRouteMatch.js'
import type { PageConfigBuildTime } from '../../types/PageConfig.js'
import { getVikeConfigInternal } from '../vite/shared/resolveVikeConfigInternal.js'
import type { HookTimeout } from '../../shared/hooks/getHook.js'
import { execHookWithoutPageContext, isUserHookError } from '../../shared/hooks/execHook.js'
import type { APIOptions } from '../api/types.js'
import { setWasPrerenderRun } from './context.js'
import { resolvePrerenderConfigGlobal, resolvePrerenderConfigLocal } from './resolvePrerenderConfig.js'
import { getOutDirs } from '../vite/shared/getOutDirs.js'
import fs from 'node:fs'
import { getProxyForPublicUsage } from '../../shared/getProxyForPublicUsage.js'
const docLink = 'https://vike.dev/i18n#pre-rendering'

type HtmlFile = {
  pageContext: PageContextPrerendered
  htmlString: string
  pageContextSerialized: string | null
  doNotCreateExtraDirectory: boolean
}

type DoNotPrerenderList = { pageId: string }[]
type ProvidedByHook = null | {
  hookFilePath: string
  hookName: 'onBeforePrerenderStart' | 'prerender'
}
type ProvidedByHookTransformer = null | {
  hookFilePath: string
  hookName: 'onPrerenderStart' | 'onBeforePrerender'
}
type PageContextPrerendered = { urlOriginal: string; _providedByHook?: ProvidedByHook; pageId: string }
type PrerenderedPageContexts = Record<string, PageContextPrerendered>

type PrerenderContextPublic = Pick<
  PrerenderContext,
  // Needed by https://vike.dev/i18n#pre-rendering
  | 'pageContexts'
  // Needed by vite-plugin-vercel
  | 'output'
>
type PrerenderContext = {
  pageContexts: PageContext[]
  output: Output
  _pageContextInit: Record<string, unknown> | null
  _noExtraDir: boolean | null
  _prerenderedPageContexts: PrerenderedPageContexts
}
type Output<PageContext = PageContextPrerendered> = {
  filePath: string
  fileType: FileType
  fileContent: string
  pageContext: PageContext
}[]
type FileType = 'HTML' | 'JSON'

type PageContext = Awaited<ReturnType<typeof createPageContextPrerendering>> & {
  _urlOriginalBeforeHook?: string
}

type PrerenderOptions = APIOptions & {
  /** Initial `pageContext` values */
  pageContextInit?: Record<string, unknown>
  /** @experimental Don't use without having talked to a vike maintainer. */
  onPagePrerender?: Function

  // TODO/v1-release: remove
  // =====================
  // ==== Deprecated  ====
  // =====================
  /** @deprecated Define `prerender({ viteConfig: { root }})` instead. */
  root?: string
  /** @deprecated Define `prerender({ viteConfig: { configFile }})` instead. */
  configFile?: string
  /** @deprecated Define `partial` in vite.config.js instead, see https://vike.dev/prerender */
  partial?: boolean
  /** @deprecated Define `noExtraDir` in vite.config.js instead, see https://vike.dev/prerender */
  noExtraDir?: boolean
  /** @deprecated Define `parallel` in vite.config.js instead, see https://vike.dev/prerender */
  parallel?: number
  /** @deprecated */
  outDir?: string
  /** @deprecated */
  base?: string
}

async function runPrerender(options: PrerenderOptions = {}, standaloneTrigger?: '$ vike prerender' | 'prerender()') {
  setWasPrerenderRun()
  checkOutdatedOptions(options)
  onSetupPrerender()
  setGlobalContext_isPrerendering()
  getHook_setIsPrerenderering()

  const logLevel = !!options.onPagePrerender ? 'warn' : 'info'
  if (logLevel === 'info') {
    console.log(`${pc.cyan(`vike v${PROJECT_VERSION}`)} ${pc.green('pre-rendering HTML...')}`)
  }

  await disableReactStreaming()

  const viteConfig = await resolveViteConfig(options.viteConfig || {}, 'build', 'production')
  const vikeConfig = await getVikeConfigInternal()

  const { outDirClient, outDirServer } = getOutDirs(viteConfig)
  const { root } = viteConfig
  const prerenderConfigGlobal = resolvePrerenderConfigGlobal(vikeConfig)
  const { partial, noExtraDir, parallel, defaultLocalValue, isPrerenderingEnabled } = prerenderConfigGlobal
  if (!isPrerenderingEnabled) {
    assert(standaloneTrigger)
    /* TODO/v1-release: use this assertUsage() again.
     * - Make sure https://github.com/magne4000/vite-plugin-vercel/pull/156 is merged before using this assertUsage() again. (Otherwise vite-plugin-vercel will trigger this assertUsage() call.)
     *   - Done: PR is merged as of June 20205
    assertUsage(
      false,
      `You're executing ${pc.cyan(standaloneTrigger)} but you didn't enable pre-rendering. Use the ${pc.cyan('prerender')} setting (${pc.underline('https://vike.dev/prerender')}) to enable pre-rendering for at least one page.`
    )
    */
    return { viteConfig }
  }

  const concurrencyLimit = pLimit(
    parallel === false || parallel === 0 ? 1 : parallel === true || parallel === undefined ? cpus().length : parallel
  )

  await initGlobalContext_runPrerender()
  const { globalContext } = await getGlobalContextServerInternal()
  globalContext._pageFilesAll.forEach(assertExportNames)

  const prerenderContext: PrerenderContext = {
    pageContexts: [],
    output: [],
    _noExtraDir: noExtraDir,
    _pageContextInit: options.pageContextInit ?? null,
    _prerenderedPageContexts: {}
  }

  const doNotPrerenderList: DoNotPrerenderList = []
  await collectDoNoPrerenderList(
    vikeConfig._pageConfigs,
    doNotPrerenderList,
    defaultLocalValue,
    concurrencyLimit,
    globalContext
  )

  // Allow user to create `pageContext` for parameterized routes and/or bulk data fetching
  // https://vike.dev/onBeforePrerenderStart
  await callOnBeforePrerenderStartHooks(prerenderContext, globalContext, concurrencyLimit, doNotPrerenderList)

  // Create `pageContext` for each page with a static route
  const urlList = getUrlListFromPagesWithStaticRoute(globalContext, doNotPrerenderList)
  await createPageContexts(urlList, prerenderContext, globalContext, concurrencyLimit, false)

  // Create `pageContext` for 404 page
  const urlList404 = getUrlList404(globalContext)
  await createPageContexts(urlList404, prerenderContext, globalContext, concurrencyLimit, true)

  // Allow user to duplicate the list of `pageContext` for i18n
  // https://vike.dev/onPrerenderStart
  await callOnPrerenderStartHook(prerenderContext, globalContext, concurrencyLimit)

  let prerenderedCount = 0
  // Write files as soon as pages finish rendering (instead of writing all files at once only after all pages have rendered).
  const onComplete = async (htmlFile: HtmlFile) => {
    prerenderedCount++
    const { pageId } = htmlFile.pageContext
    assert(pageId)
    prerenderContext._prerenderedPageContexts[pageId] = htmlFile.pageContext
    await writeFiles(htmlFile, root, outDirClient, options.onPagePrerender, prerenderContext.output, logLevel)
  }

  await prerenderPages(prerenderContext, concurrencyLimit, onComplete)
  warnContradictoryNoPrerenderList(prerenderContext._prerenderedPageContexts, doNotPrerenderList)

  if (logLevel === 'info') {
    console.log(`${pc.green(`✓`)} ${prerenderedCount} HTML documents pre-rendered.`)
  }

  await warnMissingPages(prerenderContext._prerenderedPageContexts, globalContext, doNotPrerenderList, partial)

  const prerenderContextPublic = preparePrerenderContextForPublicUsage(prerenderContext)
  objectAssign(vikeConfig.prerenderContext, prerenderContextPublic, true)

  if (prerenderConfigGlobal.isPrerenderingEnabledForAllPages && !prerenderConfigGlobal.keepDistServer) {
    fs.rmSync(outDirServer, { recursive: true })
  }

  return { viteConfig }
}

async function collectDoNoPrerenderList(
  pageConfigs: PageConfigBuildTime[],
  doNotPrerenderList: DoNotPrerenderList,
  defaultLocalValue: boolean,
  concurrencyLimit: PLimit,
  globalContext: GlobalContextServerInternal
) {
  // V1 design
  pageConfigs.forEach((pageConfig) => {
    const prerenderConfigLocal = resolvePrerenderConfigLocal(pageConfig)
    const { pageId } = pageConfig
    if (!prerenderConfigLocal) {
      if (!defaultLocalValue) {
        doNotPrerenderList.push({ pageId })
      }
    } else {
      const { value } = prerenderConfigLocal
      if (value === false) {
        doNotPrerenderList.push({ pageId })
      }
    }
  })

  // Old design
  // TODO/v1-release: remove
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
        doNotPrerenderList.push({ pageId })
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
  globalContext: GlobalContextServerInternal,
  concurrencyLimit: PLimit,
  doNotPrerenderList: DoNotPrerenderList
) {
  const onBeforePrerenderStartHooks: {
    hookFn: Function
    // prettier-ignore
    // biome-ignore format:
    hookName:
    // 0.4 design
    | 'prerender'
    // V1 design
    | 'onBeforePrerenderStart'
    hookFilePath: string
    pageId: string
    hookTimeout: HookTimeout
  }[] = []

  // V1 design
  await Promise.all(
    globalContext._pageConfigs.map((pageConfig) =>
      concurrencyLimit(async () => {
        const hookName = 'onBeforePrerenderStart'
        const pageConfigLoaded = await loadConfigValues(pageConfig, false)
        const hook = getHookFromPageConfig(pageConfigLoaded, hookName)
        if (!hook) return
        const { hookFn, hookFilePath, hookTimeout } = hook
        onBeforePrerenderStartHooks.push({
          hookFn,
          hookName: 'onBeforePrerenderStart',
          hookFilePath,
          pageId: pageConfig.pageId,
          hookTimeout
        })
      })
    )
  )

  // 0.4 design
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

          const hookFn = p.fileExports?.prerender
          if (!hookFn) return
          assertUsage(isCallable(hookFn), `\`export { prerender }\` of ${p.filePath} should be a function.`)
          const hookFilePath = p.filePath
          assert(hookFilePath)
          onBeforePrerenderStartHooks.push({
            hookFn,
            hookName: 'prerender',
            hookFilePath,
            pageId: p.pageId,
            hookTimeout: getHookTimeoutDefault('onBeforePrerenderStart')
          })
        })
      )
  )

  await Promise.all(
    onBeforePrerenderStartHooks.map(({ pageId, ...hook }) =>
      concurrencyLimit(async () => {
        if (doNotPrerenderList.find((p) => p.pageId === pageId)) return
        const { hookName, hookFilePath } = hook

        const prerenderResult = await execHookWithoutPageContext(() => hook.hookFn(), hook)
        const result = normalizeOnPrerenderHookResult(prerenderResult, hookFilePath, hookName)

        // Handle result
        await Promise.all(
          result.map(async ({ url, pageContext }) => {
            // Assert no duplication
            {
              const pageContextFound: PageContext | undefined = prerenderContext.pageContexts.find((pageContext) =>
                isSameUrl(pageContext.urlOriginal, url)
              )
              if (pageContextFound) {
                assert(pageContextFound._providedByHook)
                const providedTwice =
                  hookFilePath === pageContextFound._providedByHook.hookFilePath
                    ? (`twice by the ${hookName}() hook (${hookFilePath})` as const)
                    : (`twice: by the ${hookName}() hook (${hookFilePath}) as well as by the hook ${pageContextFound._providedByHook.hookFilePath}() (${pageContextFound._providedByHook.hookName})` as const)
                assertUsage(
                  false,
                  `URL ${pc.cyan(url)} provided ${providedTwice}. Make sure to provide the URL only once instead.`
                )
              }
            }

            // Add result
            const providedByHook = { hookFilePath, hookName }
            const pageContextNew = await createPageContextPrerendering(
              url,
              prerenderContext,
              globalContext,
              false,
              undefined,
              providedByHook
            )
            prerenderContext.pageContexts.push(pageContextNew)
            if (pageContext) {
              objectAssign(pageContextNew, { _pageContextAlreadyProvidedByOnPrerenderHook: true })
              objectAssign(pageContextNew, pageContext)
            }
          })
        )
      })
    )
  )
}

function getUrlListFromPagesWithStaticRoute(
  globalContext: GlobalContextServerInternal,
  doNotPrerenderList: DoNotPrerenderList
) {
  const urlList: UrlListEntry[] = []
  globalContext._pageRoutes.map((pageRoute) => {
    const { pageId } = pageRoute

    if (doNotPrerenderList.find((p) => p.pageId === pageId)) return

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
    urlList.push({ urlOriginal, pageId })
  })
  return urlList
}
function getUrlList404(globalContext: GlobalContextServerInternal): UrlListEntry[] {
  const urlList: UrlListEntry[] = []
  const errorPageId = getErrorPageId(globalContext._pageFilesAll, globalContext._pageConfigs)
  if (errorPageId) {
    urlList.push({
      // A URL is required for `viteDevServer.transformIndexHtml(url,html)`
      urlOriginal: '/404',
      pageId: errorPageId
    })
  }
  return urlList
}

type UrlListEntry = {
  urlOriginal: string
  pageId: string
}
async function createPageContexts(
  urlList: UrlListEntry[],
  prerenderContext: PrerenderContext,
  globalContext: GlobalContextServerInternal,
  concurrencyLimit: PLimit,
  is404: boolean
) {
  await Promise.all(
    urlList.map(({ urlOriginal, pageId }) =>
      concurrencyLimit(async () => {
        // Already included in a onBeforePrerenderStart() hook
        if (prerenderContext.pageContexts.find((pageContext) => isSameUrl(pageContext.urlOriginal, urlOriginal))) {
          return
        }
        const pageContext = await createPageContextPrerendering(
          urlOriginal,
          prerenderContext,
          globalContext,
          is404,
          pageId,
          null
        )
        prerenderContext.pageContexts.push(pageContext)
      })
    )
  )
}

async function createPageContextPrerendering(
  urlOriginal: string,
  prerenderContext: PrerenderContext,
  globalContext: GlobalContextServerInternal,
  is404: boolean,
  pageId: string | undefined,
  providedByHook: ProvidedByHook
) {
  const pageContextInit = {
    urlOriginal,
    ...prerenderContext._pageContextInit
  }
  const pageContext = await createPageContextServerSide(pageContextInit, globalContext, {
    isPrerendering: true
  })
  assert(pageContext.isPrerendering === true)
  objectAssign(pageContext, {
    _urlHandler: null,
    _httpRequestId: null,
    _urlRewrite: null,
    _noExtraDir: prerenderContext._noExtraDir,
    _prerenderContext: prerenderContext,
    _providedByHook: providedByHook,
    _urlOriginalModifiedByHook: null as ProvidedByHookTransformer,
    is404
  })

  if (!is404) {
    const pageContextFromRoute = await route(pageContext)
    assert(hasProp(pageContextFromRoute, 'pageId', 'null') || hasProp(pageContextFromRoute, 'pageId', 'string')) // Help TS
    assertRouteMatch(pageContextFromRoute, pageContext)
    assert(pageContextFromRoute.pageId)
    objectAssign(pageContext, pageContextFromRoute)
  } else {
    assert(pageId)
    objectAssign(pageContext, {
      pageId,
      _debugRouteMatches: [],
      routeParams: {}
    })
  }

  objectAssign(pageContext, await loadPageConfigsLazyServerSide(pageContext))

  let usesClientRouter: boolean
  {
    const { pageId } = pageContext
    assert(pageId)
    assert(globalContext._isPrerendering)
    if (globalContext._pageConfigs.length > 0) {
      const pageConfig = globalContext._pageConfigs.find((p) => p.pageId === pageId)
      assert(pageConfig)
      usesClientRouter = getConfigValueRuntime(pageConfig, 'clientRouting', 'boolean')?.value ?? false
    } else {
      usesClientRouter = globalContext._usesClientRouter
    }
  }
  objectAssign(pageContext, { _usesClientRouter: usesClientRouter })

  return pageContext
}

function assertRouteMatch(
  pageContextFromRoute: Awaited<ReturnType<typeof route>>,
  pageContext: {
    urlOriginal: string
    _providedByHook: ProvidedByHook
    _urlOriginalModifiedByHook: ProvidedByHookTransformer
  }
) {
  if (pageContextFromRoute.pageId !== null) {
    assert(pageContextFromRoute.pageId)
    return
  }
  let hookName: string | undefined
  let hookFilePath: string | undefined
  if (pageContext._urlOriginalModifiedByHook) {
    hookName = pageContext._urlOriginalModifiedByHook.hookName
    hookFilePath = pageContext._urlOriginalModifiedByHook.hookFilePath
  } else if (pageContext._providedByHook) {
    hookName = pageContext._providedByHook.hookName
    hookFilePath = pageContext._providedByHook.hookFilePath
  }
  if (hookName) {
    assert(hookFilePath)
    const { urlOriginal } = pageContext
    assert(urlOriginal)
    assertUsage(
      false,
      `The ${hookName}() hook defined by ${hookFilePath} returns a URL ${pc.cyan(
        urlOriginal
      )} that ${noRouteMatch}. Make sure that the URLs returned by ${hookName}() always match the route of a page.`
    )
  } else {
    // `prerenderHookFile` is `null` when the URL was deduced by the Filesytem Routing of `.page.js` files. The `onBeforeRoute()` can override Filesystem Routing; it is therefore expected that the deduced URL may not match any page.
    assert(pageContextFromRoute._routingProvidedByOnBeforeRouteHook)
    // Abort since the URL doesn't correspond to any page
    return
  }
}

async function callOnPrerenderStartHook(
  prerenderContext: PrerenderContext,
  globalContext: GlobalContextServerInternal,
  concurrencyLimit: PLimit
) {
  let onPrerenderStartHook:
    | undefined
    | {
        hookFn: unknown
        hookFilePath: string
        // prettier-ignore
        // biome-ignore format:
        hookName:
      // V1 design
      'onPrerenderStart' |
      // Old design
      'onBeforePrerender',
        hookTimeout: HookTimeout
      }

  // V1 design
  if (globalContext._pageConfigs.length > 0) {
    const hookName = 'onPrerenderStart'
    const hook = getHookFromPageConfigGlobal(globalContext._pageConfigGlobal, hookName)
    if (hook) {
      assert(hook.hookName === 'onPrerenderStart')
      onPrerenderStartHook = {
        ...hook,
        // Make TypeScript happy
        hookName
      }
    }
  }

  // Old design
  // TODO/v1-release: remove
  if (globalContext._pageConfigs.length === 0) {
    const hookTimeout = getHookTimeoutDefault('onBeforePrerender')

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
    onPrerenderStartHook = {
      hookFn: hook.onBeforePrerender,
      hookFilePath: hook.hookFilePath,
      hookName: 'onBeforePrerender',
      hookTimeout
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
            ' uses pageContext.url but it should use pageContext.urlOriginal instead, see https://vike.dev/migration/0.4.23',
          { showStackTrace: true, onlyOnce: true }
        )
        return pageContext.urlOriginal
      },
      enumerable: false,
      configurable: true
    })
    assert(isPropertyGetter(pageContext, 'url'))
    assert(pageContext.urlOriginal)
    pageContext._urlOriginalBeforeHook = pageContext.urlOriginal
  })

  prerenderContext.pageContexts.forEach((pageContext) => {
    // Preserve URL computed properties when the user is copying pageContext is his onPrerenderStart() hook, e.g. /examples/i18n/
    // https://vike.dev/i18n#pre-rendering
    preservePropertyGetters(pageContext)
  })

  const prerenderContextPublic = preparePrerenderContextForPublicUsage(prerenderContext)
  let result: unknown = await execHookWithoutPageContext(() => hookFn(prerenderContextPublic), onPrerenderStartHook)

  // Before applying result
  prerenderContext.pageContexts.forEach((pageContext) => {
    ;(pageContext as any)._restorePropertyGetters?.()
  })

  if (result === null || result === undefined) {
    return
  }

  const errPrefix = `The ${hookName}() hook exported by ${hookFilePath}`
  const rightUsage = `${errPrefix} should return ${pc.cyan('null')}, ${pc.cyan('undefined')}, or ${pc.cyan(
    '{ prerenderContext: { pageContexts } }'
  )}`

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
      `${errPrefix} returns ${pc.cyan(
        '{ globalContext: { prerenderPageContexts } }'
      )} but the return value has been renamed to ${pc.cyan('{ prerenderContext: { pageContexts } }')}, see ${docLink}`,
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

  prerenderContext.pageContexts.forEach((pageContext: { urlOriginal?: string; url?: string }) => {
    // TODO/v1-release: remove
    if (pageContext.url && !isPropertyGetter(pageContext, 'url')) {
      assertWarning(
        false,
        msgPrefix +
          ' provided pageContext.url but it should provide pageContext.urlOriginal instead, see https://vike.dev/migration/0.4.23',
        { onlyOnce: true }
      )
      pageContext.urlOriginal = pageContext.url
    }
    delete pageContext.url
  })

  // After applying result
  prerenderContext.pageContexts.forEach((pageContext) => {
    ;(pageContext as any)._restorePropertyGetters?.()
  })

  // Assert URL modified by user
  await Promise.all(
    prerenderContext.pageContexts.map((pageContext: PageContext) =>
      concurrencyLimit(async () => {
        if (pageContext.urlOriginal !== pageContext._urlOriginalBeforeHook && !pageContext.is404) {
          pageContext._urlOriginalModifiedByHook = {
            hookFilePath,
            hookName
          }
          const pageContextFromRoute = await route(
            pageContext,
            // Avoid calling onBeforeRoute() twice, otherwise onBeforeRoute() will wrongfully believe URL doesn't have locale after onBeforeRoute() already removed the local from the URL when called the first time.
            true
          )
          assertRouteMatch(pageContextFromRoute, pageContext)
        }
      })
    )
  )
}

async function prerenderPages(
  prerenderContext: PrerenderContext,
  concurrencyLimit: PLimit,
  onComplete: (htmlFile: HtmlFile) => Promise<void>
) {
  await Promise.all(
    prerenderContext.pageContexts.map((pageContextBeforeRender) =>
      concurrencyLimit(async () => {
        let res: Awaited<ReturnType<typeof prerenderPage>>
        try {
          res = await prerenderPage(pageContextBeforeRender)
        } catch (err) {
          assertIsNotAbort(err, pc.cyan(pageContextBeforeRender.urlOriginal))
          throw err
        }
        const { documentHtml, pageContext } = res
        const pageContextSerialized = pageContext.is404 ? null : res.pageContextSerialized
        await onComplete({
          pageContext,
          htmlString: documentHtml,
          pageContextSerialized,
          doNotCreateExtraDirectory: prerenderContext._noExtraDir ?? pageContext.is404
        })
      })
    )
  )
}

function warnContradictoryNoPrerenderList(
  prerenderedPageContexts: PrerenderedPageContexts,
  doNotPrerenderList: DoNotPrerenderList
) {
  Object.entries(prerenderedPageContexts).forEach(([pageId, pageContext]) => {
    const doNotPrerenderListEntry = doNotPrerenderList.find((p) => p.pageId === pageId)
    const { urlOriginal, _providedByHook: providedByHook } = pageContext
    {
      const isContradictory = !!doNotPrerenderListEntry && providedByHook
      if (!isContradictory) return
    }
    assertWarning(
      false,
      `The ${providedByHook.hookName}() hook defined by ${providedByHook.hookFilePath} returns the URL ${pc.cyan(
        urlOriginal
      )} matching the route of the page ${pc.cyan(pageId)} which isn't configured to be pre-rendered. This is contradictory: either enable pre-rendering for ${pc.cyan(pageId)} or remove the URL ${pc.cyan(urlOriginal)} from the list of URLs to be pre-rendered.`,
      { onlyOnce: true }
    )
  })
}

async function warnMissingPages(
  prerenderedPageContexts: Record<string, unknown>,
  globalContext: GlobalContextServerInternal,
  doNotPrerenderList: DoNotPrerenderList,
  partial: boolean
) {
  const isV1 = globalContext._pageConfigs.length > 0
  const hookName = isV1 ? 'onBeforePrerenderStart' : 'prerender'
  /* TODO/after-v1-design-release: document setting `prerender: false` as an alternative to using prerender.partial (both in the warnings and the docs)
  const optOutName = isV1 ? 'prerender' : 'doNotPrerender'
  const msgAddendum = `Explicitly opt-out by setting the config ${optOutName} to ${isV1 ? 'false' : 'true'} or use the option prerender.partial`
  */
  globalContext._allPageIds
    .filter((pageId) => !prerenderedPageContexts[pageId])
    .filter((pageId) => !doNotPrerenderList.find((p) => p.pageId === pageId))
    .filter((pageId) => !isErrorPage(pageId, globalContext._pageConfigs))
    .forEach((pageId) => {
      const pageAt = isV1 ? pageId : `\`${pageId}.page.*\``
      assertWarning(
        partial,
        `Cannot pre-render page ${pageAt} because it has a non-static route, while no ${hookName}() hook returned any URL matching the page's route. You need to use a ${hookName}() hook (https://vike.dev/${hookName}) providing a list of URLs for ${pageAt} that should be pre-rendered. If you don't want to pre-render ${pageAt} then use the option prerender.partial (https://vike.dev/prerender#partial) to suppress this warning.`,
        { onlyOnce: true }
      )
    })
}

async function writeFiles(
  { pageContext, htmlString, pageContextSerialized, doNotCreateExtraDirectory }: HtmlFile,
  root: string,
  outDirClient: string,
  onPagePrerender: Function | undefined,
  output: Output,
  logLevel: 'warn' | 'info'
) {
  const { urlOriginal } = pageContext
  assert(urlOriginal.startsWith('/'))

  const writeJobs = [
    write(
      urlOriginal,
      pageContext,
      'HTML',
      htmlString,
      root,
      outDirClient,
      doNotCreateExtraDirectory,
      onPagePrerender,
      output,
      logLevel
    )
  ]
  if (pageContextSerialized !== null) {
    writeJobs.push(
      write(
        urlOriginal,
        pageContext,
        'JSON',
        pageContextSerialized,
        root,
        outDirClient,
        doNotCreateExtraDirectory,
        onPagePrerender,
        output,
        logLevel
      )
    )
  }
  await Promise.all(writeJobs)
}

async function write(
  urlOriginal: string,
  pageContext: PageContextPrerendered,
  fileType: FileType,
  fileContent: string,
  root: string,
  outDirClient: string,
  doNotCreateExtraDirectory: boolean,
  onPagePrerender: Function | undefined,
  output: Output,
  logLevel: 'info' | 'warn'
) {
  let fileUrl: string
  if (fileType === 'HTML') {
    fileUrl = urlToFile(urlOriginal, '.html', doNotCreateExtraDirectory)
  } else {
    assert(fileType === 'JSON')
    fileUrl = getPageContextRequestUrl(urlOriginal)
  }

  assertPosixPath(fileUrl)
  assert(fileUrl.startsWith('/'))
  const filePathRelative = fileUrl.slice(1)
  assert(
    !filePathRelative.startsWith('/'),
    // Let's remove this debug info after we add a assertUsage() avoiding https://github.com/vikejs/vike/issues/1929
    { urlOriginal, fileUrl }
  )
  assertPosixPath(outDirClient)
  assertPosixPath(filePathRelative)
  const filePath = path.posix.join(outDirClient, filePathRelative)

  objectAssign(pageContext, {
    _prerenderResult: {
      filePath,
      fileContent
    }
  })
  output.push({
    filePath,
    fileType,
    fileContent,
    pageContext
  })

  if (onPagePrerender) {
    await onPagePrerender(pageContext)
  } else {
    const { promises } = await import('fs')
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
}

function normalizeOnPrerenderHookResult(
  prerenderResult: unknown,
  prerenderHookFile: string,
  hookName: 'prerender' | 'onBeforePrerenderStart'
): { url: string; pageContext: null | Record<string, unknown> }[] {
  if (isArray(prerenderResult)) {
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
    const errHint = `Make sure your ${hookName}() hook returns an object ${pc.cyan(
      '{ url, pageContext }'
    )} or an array of such objects.` as const
    assertUsage(isPlainObject(prerenderElement), `${errMsg2}. ${errHint}`)
    assertUsage(hasProp(prerenderElement, 'url'), `${errMsg2}: ${pc.cyan('url')} is missing. ${errHint}`)
    assertUsage(
      hasProp(prerenderElement, 'url', 'string'),
      `${errMsg2}: ${pc.cyan('url')} should be a string (but ${pc.cyan(
        `typeof url === "${typeof prerenderElement.url}"`
      )}).`
    )
    assertUsage(
      prerenderElement.url.startsWith('/'),
      `${errMsg1} a URL with an invalid value ${pc.cyan(prerenderElement.url)} which doesn't start with ${pc.cyan(
        '/'
      )}. Make sure each URL starts with ${pc.cyan('/')}.`
    )
    Object.keys(prerenderElement).forEach((key) => {
      assertUsage(
        key === 'url' || key === 'pageContext',
        `${errMsg2}: unexpected object key ${pc.cyan(key)}. ${errHint}`
      )
    })
    if (!hasProp(prerenderElement, 'pageContext')) {
      prerenderElement.pageContext = null
    } else if (!hasProp(prerenderElement, 'pageContext', 'null')) {
      assertUsage(
        hasProp(prerenderElement, 'pageContext', 'object'),
        `${errMsg1} an invalid ${pc.cyan('pageContext')} value: make sure ${pc.cyan('pageContext')} is an object.`
      )
      assertUsage(
        isPlainObject(prerenderElement.pageContext),
        `${errMsg1} an invalid ${pc.cyan('pageContext')} object: make sure ${pc.cyan(
          'pageContext'
        )} is a plain JavaScript object.`
      )
    }
    assert(hasProp(prerenderElement, 'pageContext', 'object') || hasProp(prerenderElement, 'pageContext', 'null'))
    return prerenderElement
  }
}

// TODO/v1-release: remove
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
      `[prerender()] Option ${pc.cyan(prop)} is deprecated. Define ${pc.cyan(
        prop
      )} in vite.config.js instead. See https://vike.dev/prerender`,
      { showStackTrace: true }
    )
  })
  ;(['base', 'outDir'] as const).forEach((prop) => {
    assertWarning(
      options[prop] === undefined,
      `[prerender()] Option ${pc.cyan(prop)} is outdated and has no effect (vike now automatically determines ${pc.cyan(
        prop
      )})`,
      {
        showStackTrace: true,
        onlyOnce: true
      }
    )
  })
}

async function disableReactStreaming() {
  let mod: any
  try {
    mod = await import('react-streaming/server')
  } catch {
    return
  }
  const { disable } = mod
  disable()
}

function isSameUrl(url1: string, url2: string) {
  return normalizeUrl(url1) === normalizeUrl(url2)
}
function normalizeUrl(url: string) {
  return '/' + url.split('/').filter(Boolean).join('/')
}

function assertIsNotAbort(err: unknown, urlOriginal: string) {
  if (!isAbortError(err)) return
  const pageContextAbort = err._pageContextAbort

  const hookLoc = isUserHookError(err)
  assert(hookLoc)
  const thrownBy = ` by ${pc.cyan(`${hookLoc.hookName}()`)} hook defined at ${hookLoc.hookFilePath}`

  const abortCaller = pageContextAbort._abortCaller
  assert(abortCaller)

  const abortCall = pageContextAbort._abortCall
  assert(abortCall)

  assertUsage(
    false,
    `${pc.cyan(abortCall)} thrown${thrownBy} while pre-rendering ${urlOriginal} but ${pc.cyan(
      abortCaller
    )} isn't supported for pre-rendered pages`
  )
}

function preparePrerenderContextForPublicUsage(prerenderContext: PrerenderContext) {
  // TODO/v1-release: remove
  if (!('prerenderPageContexts' in prerenderContext)) {
    Object.defineProperty(prerenderContext, 'prerenderPageContexts', {
      get() {
        assertWarning(false, `prerenderPageContexts has been renamed pageContexts, see ${pc.underline(docLink)}`, {
          showStackTrace: true,
          onlyOnce: true
        })
        return prerenderContext.pageContexts
      }
    })
  }

  // Required because of https://vike.dev/i18n#pre-rendering
  // - Thus, we have to let users access the original pageContext object => we cannot use ES proxies and we cannot use preparePageContextForPublicUsage()
  prerenderContext.pageContexts.forEach((pageContext) => {
    changeEnumerable(pageContext, '_isOriginalObject', true)
  })

  const prerenderContextPublic = getProxyForPublicUsage(prerenderContext, 'prerenderContext')
  return prerenderContextPublic
}
