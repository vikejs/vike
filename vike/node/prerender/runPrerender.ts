export { runPrerenderFromAPI }
export { runPrerenderFromCLI }
export { runPrerenderFromAutoFullBuild }
export { runPrerender_forceExit }
export type { PrerenderOptions }

import '../runtime/page-files/setup.js'
import path from 'path'
import { route } from '../../shared/route/index.js'
import {
  assert,
  assertUsage,
  assertWarning,
  hasProp,
  projectInfo,
  objectAssign,
  isObjectWithKeys,
  isCallable,
  getOutDirs,
  isPropertyGetter,
  assertPosixPath,
  urlToFile,
  executeHook,
  isPlainObject,
  setNodeEnvToProduction,
  isUserHookError
} from './utils.js'
import { pLimit, PLimit } from '../../utils/pLimit.js'
import {
  prerenderPage,
  prerender404Page,
  getRenderContext,
  type RenderContext,
  getPageContextInitEnhanced,
  PageContextInitEnhanced
} from '../runtime/renderPage/renderPageAlreadyRouted.js'
import pc from '@brillout/picocolors'
import { cpus } from 'os'
import type { PageFile } from '../../shared/getPageFiles.js'
import { getGlobalContext, initGlobalContext } from '../runtime/globalContext.js'
import { resolveConfig } from 'vite'
import { getConfigVike } from '../shared/getConfigVike.js'
import type { InlineConfig } from 'vite'
import { getPageFilesServerSide } from '../../shared/getPageFiles.js'
import { getPageContextRequestUrl } from '../../shared/getPageContextRequestUrl.js'
import { getUrlFromRouteString } from '../../shared/route/resolveRouteString.js'
import { getConfigValue, getConfigValueFilePathToShowToUser } from '../../shared/page-configs/helpers.js'
import { loadConfigValues } from '../../shared/page-configs/loadConfigValues.js'
import { isErrorPage } from '../../shared/error-page.js'
import { addUrlComputedProps, PageContextUrlComputedPropsInternal } from '../../shared/addUrlComputedProps.js'
import { assertPathIsFilesystemAbsolute } from '../../utils/assertPathIsFilesystemAbsolute.js'
import { isAbortError } from '../../shared/route/abort.js'
import { loadUserFilesServerSide } from '../runtime/renderPage/loadUserFilesServerSide.js'
import {
  getHookFromPageConfig,
  getHookFromPageConfigGlobal,
  getHookTimeoutDefault,
  setIsPrerenderering
} from '../../shared/hooks/getHook.js'
import { noRouteMatch } from '../../shared/route/noRouteMatch.js'
import type { PageConfigBuildTime } from '../../shared/page-configs/PageConfig.js'
import { getVikeConfig } from '../plugin/plugins/importUserCode/v1-design/getVikeConfig.js'
import type { HookTimeout } from '../../shared/hooks/getHook.js'
import { logHintForCjsEsmError } from '../runtime/renderPage/logHintForCjsEsmError.js'
import { getRedirectsStatic } from '../../shared/route/resolveRedirects.js'
import { escapeHtml } from '../runtime/html/renderHtml.js'

type HtmlFile = {
  urlOriginal: string
  pageContext: PageContextPrerendered
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
type PageContextPrerendered = { urlOriginal: string; _providedByHook?: ProvidedByHook }
type PrerenderedPageContexts = Record<string, PageContextPrerendered>

type PrerenderContext = {
  pageContexts: PageContext[]
  pageContextInit: Record<string, unknown> | null
  _noExtraDir: boolean
}

type PageContext = PageContextInitEnhanced & {
  _urlRewrite: null
  _urlHandler: null
  _urlOriginalBeforeHook?: string
  _urlOriginalModifiedByHook?: TransformerHook
  _providedByHook: ProvidedByHook
  _pageContextAlreadyProvidedByOnPrerenderHook?: true
} & PageContextUrlComputedPropsInternal

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
   *  - Set `prerender({ viteConfig: { configFile: './path/to/vite.config.js' }})`.
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
   * Don't use without having talked to a vike maintainer.
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
  /** @deprecated Define `partial` in vite.config.js instead, see https://vike.dev/prerender-config */
  partial?: boolean
  /** @deprecated Define `noExtraDir` in vite.config.js instead, see https://vike.dev/prerender-config */
  noExtraDir?: boolean
  /** @deprecated Define `parallel` in vite.config.js instead, see https://vike.dev/prerender-config */
  parallel?: number
  /** @deprecated */
  outDir?: string
  /** @deprecated */
  base?: string
}

async function runPrerenderFromAPI(options: PrerenderOptions = {}): Promise<void> {
  await runPrerender(options, 'prerender()')
}
async function runPrerenderFromCLI(options: PrerenderOptions): Promise<void> {
  try {
    await runPrerender(options, '$ vike prerender')
  } catch (err) {
    console.error(err)
    logHintForCjsEsmError(err)
    process.exit(1)
  }
}
async function runPrerenderFromAutoFullBuild(options: PrerenderOptions): Promise<void> {
  try {
    await runPrerender(options, null)
  } catch (err) {
    console.error(err)
    logHintForCjsEsmError(err)
    process.exit(1)
  }
}
async function runPrerender(
  options: PrerenderOptions,
  manuallyTriggered: null | '$ vike prerender' | 'prerender()'
): Promise<void> {
  checkOutdatedOptions(options)

  setIsPrerenderering()

  const logLevel = !!options.onPagePrerender ? 'warn' : 'info'
  if (logLevel === 'info') {
    console.log(`${pc.cyan(`vike v${projectInfo.projectVersion}`)} ${pc.green('pre-rendering HTML...')}`)
  }

  setNodeEnvToProduction()

  await disableReactStreaming()

  const viteConfig = await resolveConfig(options.viteConfig || {}, 'vike pre-rendering' as any, 'production')
  assertLoadedConfig(viteConfig, options)
  const configVike = await getConfigVike(viteConfig)

  const { outDirClient, outDirRoot } = getOutDirs(viteConfig)
  const { root } = viteConfig
  const prerenderConfig = configVike.prerender
  if (!prerenderConfig) {
    assert(manuallyTriggered)
    assertWarning(
      prerenderConfig,
      `You're executing ${pc.cyan(manuallyTriggered)} but the config ${pc.cyan('prerender')} isn't set to true`,
      {
        onlyOnce: true
      }
    )
  }
  const { partial = false, noExtraDir = false, parallel = true } = prerenderConfig || {}

  const concurrencyLimit = pLimit(
    parallel === false || parallel === 0 ? 1 : parallel === true || parallel === undefined ? cpus().length : parallel
  )

  assertPathIsFilesystemAbsolute(outDirRoot) // Needed for loadImportBuild(outDir) of @brillout/vite-plugin-server-entry
  await initGlobalContext(true, outDirRoot)
  const globalContext = getGlobalContext()
  assert(globalContext.isPrerendering)
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
  const vikeConfig = await getVikeConfig(viteConfig, false)
  await collectDoNoPrerenderList(renderContext, vikeConfig.pageConfigs, doNotPrerenderList, concurrencyLimit)

  await callOnBeforePrerenderStartHooks(prerenderContext, renderContext, concurrencyLimit, doNotPrerenderList)

  await handlePagesWithStaticRoutes(prerenderContext, renderContext, doNotPrerenderList, concurrencyLimit)

  await callOnPrerenderStartHook(prerenderContext, renderContext)

  const prerenderedPageContexts: PrerenderedPageContexts = {}
  let prerenderedCount = 0
  const onComplete = async (htmlFile: HtmlFile) => {
    prerenderedCount++
    if (htmlFile.pageId) {
      prerenderedPageContexts[htmlFile.pageId] = htmlFile.pageContext
    }
    await writeFiles(htmlFile, root, outDirClient, options.onPagePrerender, logLevel)
  }

  await routeAndPrerender(prerenderContext, concurrencyLimit, onComplete)

  warnContradictoryNoPrerenderList(prerenderedPageContexts, doNotPrerenderList)

  await prerender404(prerenderedPageContexts, renderContext, prerenderContext, onComplete)
  await prerenderRedirects(globalContext.redirects, prerenderedPageContexts, renderContext, prerenderContext, onComplete)

  if (logLevel === 'info') {
    console.log(`${pc.green(`✓`)} ${prerenderedCount} HTML documents pre-rendered.`)
  }

  warnMissingPages(prerenderedPageContexts, doNotPrerenderList, renderContext, partial)
}

async function collectDoNoPrerenderList(
  renderContext: RenderContext,
  pageConfigs: PageConfigBuildTime[],
  doNotPrerenderList: DoNotPrerenderList,
  concurrencyLimit: PLimit
) {
  // V1 design
  pageConfigs.forEach((pageConfig) => {
    const configName = 'prerender'
    const configValue = getConfigValue(pageConfig, configName, 'boolean')
    if (configValue?.value === false) {
      const configValueFilePathToShowToUser = getConfigValueFilePathToShowToUser(configValue)
      assert(configValueFilePathToShowToUser)
      doNotPrerenderList.push({
        pageId: pageConfig.pageId,
        setByConfigName: 'prerender',
        setByConfigValue: false,
        setByConfigFile: configValueFilePathToShowToUser
      })
    }
  })

  // Old design
  // TODO/v1-release: remove
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
  concurrencyLimit: PLimit,
  doNotPrerenderList: DoNotPrerenderList
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
    pageId: string
    hookTimeout: HookTimeout
  }[] = []

  // V1 design
  await Promise.all(
    renderContext.pageConfigs.map((pageConfig) =>
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
            hookFilePath,
            pageId: p.pageId,
            hookTimeout: getHookTimeoutDefault('onBeforePrerenderStart')
          })
        })
      )
  )

  await Promise.all(
    onBeforePrerenderStartHooks.map(({ hookFn, hookName, hookFilePath, pageId, hookTimeout }) =>
      concurrencyLimit(async () => {
        if (doNotPrerenderList.find((p) => p.pageId === pageId)) {
          return
        }

        const prerenderResult: unknown = await executeHook(() => hookFn(), { hookName, hookFilePath, hookTimeout })
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
                  ? (`twice by the ${hookName}() hook (${hookFilePath})` as const)
                  : (`twice: by the ${hookName}() hook (${hookFilePath}) as well as by the hook ${pageContextFound._providedByHook.hookFilePath}() (${pageContextFound._providedByHook.hookName})` as const)
              assertUsage(
                false,
                `URL ${pc.cyan(url)} provided ${providedTwice}. Make sure to provide the URL only once instead.`
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
          _debugRouteMatches: [
            {
              pageId,
              routeType: pageRoute.routeType,
              routeString: urlOriginal,
              routeParams
            }
          ]
        })
        objectAssign(pageContext, await loadUserFilesServerSide(pageContext))

        prerenderContext.pageContexts.push(pageContext)
      })
    )
  )
}

function createPageContext(urlOriginal: string, renderContext: RenderContext, prerenderContext: PrerenderContext) {
  const pageContext = {
    _urlHandler: null,
    _urlRewrite: null,
    _noExtraDir: prerenderContext._noExtraDir,
    _prerenderContext: prerenderContext
  }
  const pageContextInit = {
    urlOriginal,
    ...prerenderContext.pageContextInit
  }
  {
    const pageContextInitEnhanced = getPageContextInitEnhanced(pageContextInit, renderContext, {
      // We set `enumerable` to `false` to avoid computed URL properties from being iterated & copied in a onPrerenderStart() hook, e.g. /examples/i18n/
      urlComputedPropsNonEnumerable: true
    })
    objectAssign(pageContext, pageContextInitEnhanced)
  }
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
      'onBeforePrerender',
        hookTimeout: HookTimeout
      }

  // V1 design
  if (renderContext.pageConfigs.length > 0) {
    const hookName = 'onPrerenderStart'
    const hook = getHookFromPageConfigGlobal(renderContext.pageConfigGlobal, hookName)
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
  if (renderContext.pageConfigs.length === 0) {
    const hookTimeout = getHookTimeoutDefault('onBeforePrerender')

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

  const docLink = 'https://vike.dev/i18n#pre-rendering'

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
    onPrerenderStartHook
  )
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

  prerenderContext.pageContexts.forEach((pageContext: PageContext) => {
    if (pageContext.urlOriginal !== pageContext._urlOriginalBeforeHook) {
      pageContext._urlOriginalModifiedByHook = {
        hookFilePath,
        hookName
      }
    }

    // Restore as URL computed props are lost when user makes a pageContext copy
    addUrlComputedProps(pageContext)
  })
}

async function routeAndPrerender(
  prerenderContext: PrerenderContext,
  concurrencyLimit: PLimit,
  onComplete: (htmlFile: HtmlFile) => Promise<void>
) {
  const globalContext = getGlobalContext()
  assert(globalContext.isPrerendering)

  // Route all URLs
  await Promise.all(
    prerenderContext.pageContexts.map((pageContext) =>
      concurrencyLimit(async () => {
        const { urlOriginal } = pageContext
        assert(urlOriginal)
        const pageContextFromRoute = await route(pageContext)
        assert(hasProp(pageContextFromRoute, '_pageId', 'null') || hasProp(pageContextFromRoute, '_pageId', 'string'))
        if (pageContextFromRoute._pageId === null) {
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

        assert(pageContextFromRoute._pageId)
        objectAssign(pageContext, pageContextFromRoute)
        const { _pageId: pageId } = pageContext

        objectAssign(pageContext, await loadUserFilesServerSide(pageContext))

        let usesClientRouter: boolean
        {
          if (pageContext._pageConfigs.length > 0) {
            const pageConfig = pageContext._pageConfigs.find((p) => p.pageId === pageId)
            assert(pageConfig)
            usesClientRouter = getConfigValue(pageConfig, 'clientRouting', 'boolean')?.value ?? false
          } else {
            usesClientRouter = globalContext.pluginManifest.usesClientRouter
          }
        }

        objectAssign(pageContext, {
          is404: null,
          _httpRequestId: null,
          _usesClientRouter: usesClientRouter
        })

        let res: Awaited<ReturnType<typeof prerenderPage>>
        try {
          res = await prerenderPage(pageContext)
        } catch (err) {
          assertIsNotAbort(err, pc.cyan(pageContext.urlOriginal))
          throw err
        }
        const { documentHtml, pageContextSerialized } = res
        await onComplete({
          urlOriginal,
          pageContext,
          htmlString: documentHtml,
          pageContextSerialized,
          doNotCreateExtraDirectory: prerenderContext._noExtraDir,
          pageId
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
    const { setByConfigName, setByConfigValue, setByConfigFile } = doNotPrerenderListEntry
    assertWarning(
      false,
      `The ${providedByHook.hookName}() hook defined by ${providedByHook.hookFilePath} returns the URL ${pc.cyan(
        urlOriginal
      )}, while ${setByConfigFile} sets the config ${pc.cyan(setByConfigName)} to ${pc.cyan(
        String(setByConfigValue)
      )}. This is contradictory: either don't set the config ${pc.cyan(setByConfigName)} to ${pc.cyan(
        String(setByConfigValue)
      )} or remove the URL ${pc.cyan(urlOriginal)} from the list of URLs to be pre-rendered.`,
      { onlyOnce: true }
    )
  })
}

function warnMissingPages(
  prerenderedPageContexts: Record<string, unknown>,
  doNotPrerenderList: DoNotPrerenderList,
  renderContext: RenderContext,
  partial: boolean
) {
  const isV1 = renderContext.pageConfigs.length > 0
  const hookName = isV1 ? 'onBeforePrerenderStart' : 'prerender'
  /* TODO/after-v1-design-release: document setting `prerender: false` as an alternative to using prerender.partial (both in the warnings and the docs)
  const optOutName = isV1 ? 'prerender' : 'doNotPrerender'
  const msgAddendum = `Explicitly opt-out by setting the config ${optOutName} to ${isV1 ? 'false' : 'true'} or use the option prerender.partial`
  */
  renderContext.allPageIds
    .filter((pageId) => !prerenderedPageContexts[pageId])
    .filter((pageId) => !doNotPrerenderList.find((p) => p.pageId === pageId))
    .filter((pageId) => !isErrorPage(pageId, renderContext.pageConfigs))
    .forEach((pageId) => {
      const pageAt = isV1 ? pageId : `\`${pageId}.page.*\``
      assertWarning(
        partial,
        `Cannot pre-render page ${pageAt} because it has a non-static route, while no ${hookName}() hook returned any URL matching the page's route. You need to use a ${hookName}() hook (https://vike.dev/${hookName}) providing a list of URLs for ${pageAt} that should be pre-rendered. If you don't want to pre-render ${pageAt} then use the option prerender.partial (https://vike.dev/prerender-config#partial) to suppress this warning.`,
        { onlyOnce: true }
      )
    })
}

async function prerender404(
  prerenderedPageContexts: Record<string, { urlOriginal: string }>,
  renderContext: RenderContext,
  prerenderContext: PrerenderContext,
  onComplete: (htmlFile: HtmlFile) => Promise<void>
) {
  if (!Object.values(prerenderedPageContexts).find(({ urlOriginal }) => urlOriginal === '/404')) {
    let result: Awaited<ReturnType<typeof prerender404Page>>
    try {
      result = await prerender404Page(renderContext, prerenderContext.pageContextInit)
    } catch (err) {
      assertIsNotAbort(err, 'the 404 page')
      throw err
    }
    if (result) {
      const urlOriginal = '/404'
      const { documentHtml, pageContext } = result
      await onComplete({
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

async function prerenderRedirects(
  redirects: Record<string, string>,
  prerenderedPageContexts: Record<string, { urlOriginal: string }>,
  renderContext: RenderContext,
  prerenderContext: PrerenderContext,
  onComplete: (htmlFile: HtmlFile) => Promise<void>,
) {
  const redirectsStatic = getRedirectsStatic(redirects)
  for (const [urlSource, urlTarget] of Object.entries(redirectsStatic)) {
    const urlTargetSafe = escapeHtml(urlTarget)
    const htmlString = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=${urlTargetSafe}">
  <title>Redirect to ${urlTargetSafe}</title>
</head>
<body>
  <p>If you aren't redirected, <a href="${urlTargetSafe}">click here</a>.</p>
</body>
</html>`
    const urlOriginal = urlSource
    await onComplete({
      urlOriginal,
      pageContext: { urlOriginal },
      htmlString,
      pageContextSerialized: null,
      doNotCreateExtraDirectory: true,
      pageId: null
    })
  }

  if (!Object.values(prerenderedPageContexts).find(({ urlOriginal }) => urlOriginal === '/404')) {
    let result: Awaited<ReturnType<typeof prerender404Page>>
    try {
      result = await prerender404Page(renderContext, prerenderContext.pageContextInit)
    } catch (err) {
      assertIsNotAbort(err, 'the 404 page')
      throw err
    }
    if (result) {
      const urlOriginal = '/404'
      const { documentHtml, pageContext } = result
      await onComplete({
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

async function writeFiles(
  { urlOriginal, pageContext, htmlString, pageContextSerialized, doNotCreateExtraDirectory }: HtmlFile,
  root: string,
  outDirClient: string,
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
        onPagePrerender,
        logLevel
      )
    )
  }
  await Promise.all(writeJobs)
}

async function write(
  urlOriginal: string,
  pageContext: Record<string, unknown>,
  fileExtension: '.html' | '.pageContext.json',
  fileContent: string,
  root: string,
  outDirClient: string,
  doNotCreateExtraDirectory: boolean,
  onPagePrerender: Function | undefined,
  logLevel: 'info' | 'warn'
) {
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
      )} in vite.config.js instead. See https://vike.dev/prerender-config`,
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

function assertLoadedConfig(
  viteConfig: { plugins: readonly { name: string }[]; configFile?: string },
  options: { viteConfig?: InlineConfig }
) {
  if (viteConfig.plugins.some((p) => p.name.startsWith('vike'))) {
    return
  }
  const { configFile } = viteConfig
  if (configFile) {
    assertUsage(false, `${configFile} doesn't install the vike plugin`)
  } else {
    if (!options.viteConfig) {
      assertUsage(
        false,
        `[prerender()] No vite.config.js file found at ${process.cwd()}. Use the option ${pc.cyan(
          'prerender({ viteConfig })'
        )}.`,
        { showStackTrace: true }
      )
    } else {
      assertUsage(
        false,
        `[prerender()] The Vite config ${pc.cyan('prerender({ viteConfig })')} is missing the vike plugin.`,
        {
          showStackTrace: true
        }
      )
    }
  }
}

function isSameUrl(url1: string, url2: string) {
  return normalizeUrl(url1) === normalizeUrl(url2)
}
function normalizeUrl(url: string) {
  return '/' + url.split('/').filter(Boolean).join('/')
}

function runPrerender_forceExit() {
  // Force exit; known situations where pre-rendering is hanging:
  //  - https://github.com/vikejs/vike/discussions/774#discussioncomment-5584551
  //  - https://github.com/vikejs/vike/issues/807#issuecomment-1519010902
  process.exit(0)

  /* I guess there is no need to tell the user about it? Let's see if a user complains.
   * I don't known whether there is a way to call process.exit(0) only if needed, thus I'm not sure if there is a way to conditionally show a assertInfo().
  assertInfo(false, "Pre-rendering was forced exit. (Didn't gracefully exit because the event queue isn't empty. This is usally fine, see ...", { onlyOnce: false })
  */
}

function assertIsNotAbort(err: unknown, urlOr404: string) {
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
    `${pc.cyan(abortCall)} thrown${thrownBy} while pre-rendering ${urlOr404} but ${pc.cyan(
      abortCaller
    )} isn't supported for pre-rendered pages`
  )
}
