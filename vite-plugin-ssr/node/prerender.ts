import './page-files/setup'
import { join, sep, dirname, isAbsolute } from 'path'
import { isErrorPage, isStaticRoute, loadPageRoutes, route } from '../shared/route'
import {
  assert,
  assertUsage,
  assertWarning,
  hasProp,
  getFileUrl,
  isPlainObject,
  projectInfo,
  objectAssign,
  isObjectWithKeys,
  isCallable,
} from './utils'
import { setSsrEnv } from './ssrEnv'
import {
  getGlobalContext,
  GlobalContext,
  throwPrerenderError,
  loadPageFilesServer,
  prerenderPage,
  renderStatic404Page,
} from './renderPage'
import { blue, green, gray, cyan } from 'kolorist'
import pLimit from 'p-limit'
import { cpus } from 'os'
import { PageFile } from '../shared/getPageFiles'
import { getViteManifest } from './getViteManifest'
import type { PluginManifest } from './getViteManifest'

export { prerender }

type HtmlFile = {
  url: string
  pageContext: Record<string, unknown>
  htmlString: string
  pageContextSerialized: string | null
  doNotCreateExtraDirectory: boolean
  pageId: string | null
}

type DoNotPrerenderList = { pageId: string; pageServerFilePath: string }[]
type PrerenderedPageIds = Record<string, { url: string; _prerenderSourceFile: string | null }>

type GlobalPrerenderingContext = GlobalContext & {
  _isPreRendering: true
  _usesClientRouter: boolean
  prerenderPageContexts: PageContext[]
}

type PageContext = GlobalPrerenderingContext & {
  url: string
  _prerenderSourceFile: string | null
  _pageContextAlreadyProvidedByPrerenderHook?: true
}

/**
 * Render your pages (e.g. for deploying to a static host).
 * @param partial Allow only a subset of pages to be pre-rendered.
 * @param root The root directory of your project (where `vite.config.js` live) (default: `process.cwd()`).
 * @param outDir The build directory of your project (default: `dist`).
 */
async function prerender({
  onPagePrerender = null,
  pageContextInit = {},
  partial = false,
  noExtraDir = false,
  root = process.cwd(),
  outDir = 'dist',
  parallel = cpus().length || 1,
  base,
}: {
  onPagePrerender?: Function | null
  pageContextInit?: Record<string, unknown>
  partial?: boolean
  noExtraDir?: boolean
  root?: string
  outDir?: string
  base?: string
  parallel?: number
} = {}) {
  assertArguments({ partial, noExtraDir, base, root, outDir, parallel })
  assert(base === undefined)
  if (!onPagePrerender) {
    console.log(`${cyan(`vite-plugin-ssr ${projectInfo.projectVersion}`)} ${green('pre-rendering HTML...')}`)
  }

  setProductionEnvVar()

  const ssrEnv = {
    isProduction: true as const,
    root,
    outDir,
    viteDevServer: undefined,
    baseUrl: '/',
    baseAssets: null,
  }
  setSsrEnv(ssrEnv)

  const { pluginManifest, pluginManifestPath, outDirPath } = getViteManifest()
  assertPluginManifest(pluginManifest, pluginManifestPath, outDirPath)

  ssrEnv.baseUrl = pluginManifest.base
  setSsrEnv(ssrEnv)

  const concurrencyLimit = pLimit(parallel)

  const globalContext = await getGlobalContext()
  objectAssign(globalContext, {
    _isPreRendering: true as const,
    _usesClientRouter: pluginManifest.usesClientRouter,
    prerenderPageContexts: [] as PageContext[],
  })

  objectAssign(globalContext, pageContextInit)

  const doNotPrerenderList: DoNotPrerenderList = []

  await callPrerenderHooks(globalContext, doNotPrerenderList, concurrencyLimit)

  await handlePagesWithStaticRoutes(globalContext, doNotPrerenderList, concurrencyLimit)

  await callOnBeforePrerenderHook(globalContext)

  const prerenderPageIds: PrerenderedPageIds = {}
  const htmlFiles: HtmlFile[] = []
  await routeAndPrerender(globalContext, htmlFiles, prerenderPageIds, concurrencyLimit, noExtraDir)

  warnContradictoryNoPrerenderList(prerenderPageIds, doNotPrerenderList)

  await prerender404Page(htmlFiles, globalContext)

  if (!onPagePrerender) {
    console.log(`${green(`✓`)} ${htmlFiles.length} HTML documents pre-rendered.`)
  }

  await Promise.all(
    htmlFiles.map((htmlFile) =>
      writeHtmlFile(htmlFile, root, outDir, doNotPrerenderList, concurrencyLimit, onPagePrerender),
    ),
  )

  warnMissingPages(prerenderPageIds, doNotPrerenderList, globalContext, partial)
}

async function callPrerenderHooks(
  globalContext: GlobalPrerenderingContext,
  doNotPrerenderList: DoNotPrerenderList,
  concurrencyLimit: pLimit.Limit,
) {
  // Render URLs returned by `prerender()` hooks
   await Promise.all(
    globalContext._pageFilesAll
     .filter(p => p.fileType==='.page.server')
      .map((p) =>
        concurrencyLimit(async () => {
          await p.loadFileExports?.()
          if (p.fileExports?.doNotPrerender) {
            doNotPrerenderList.push({ pageId: p.pageId, pageServerFilePath: p.filePath })
            return
          }

          const prerender = p.fileExports?.prerender
          if (!prerender) return
          assertUsage(isCallable(prerender), `\`export { prerender }\` of ${p.filePath} should be a function.`)
          const prerenderSourceFile = p.filePath
          assert(prerenderSourceFile)

          let prerenderResult: unknown
          try {
            prerenderResult = await prerender()
          } catch (err) {
            throwPrerenderError(err)
            assert(false)
          }
          const result = normalizePrerenderResult(prerenderResult, prerenderSourceFile)

          result.forEach(({ url, pageContext }) => {
            assert(typeof url === 'string')
            assert(url.startsWith('/'))
            assert(pageContext === null || isPlainObject(pageContext))
            let pageContextFound: PageContext | undefined = globalContext.prerenderPageContexts.find(
              (pageContext) => pageContext.url === url,
            )
            if (!pageContextFound) {
              pageContextFound = {
                ...globalContext,
                _prerenderSourceFile: prerenderSourceFile,
                url,
              }
              globalContext.prerenderPageContexts.push(pageContextFound)
            }
            if (pageContext) {
              objectAssign(pageContextFound, {
                _pageContextAlreadyProvidedByPrerenderHook: true,
                ...pageContext,
              })
            }
          })
        }),
      ),
  )
}

async function handlePagesWithStaticRoutes(
  globalContext: GlobalPrerenderingContext,
  doNotPrerenderList: DoNotPrerenderList,
  concurrencyLimit: pLimit.Limit,
) {
  // Pre-render pages with a static route
  const { pageRoutes} = await loadPageRoutes(globalContext)
  await Promise.all(
    pageRoutes.map((pageRoute) =>
      concurrencyLimit(async () => {
        const { pageId } = pageRoute

        if (doNotPrerenderList.find((p) => p.pageId === pageId)) {
          return
        }

        let url: string
        if (pageRoute.pageRouteFile) {
          const { routeValue } = pageRoute.pageRouteFile
          if (typeof routeValue === 'string' && isStaticRoute(routeValue)) {
            assert(routeValue.startsWith('/'))
            url = routeValue
          } else {
            // Abort since the page's route is a Route Function or parameterized Route String
            return
          }
        } else {
          url = pageRoute.filesystemRoute
        }
        assert(url.startsWith('/'))

        // Already included in a `prerender()` hook
        if (globalContext.prerenderPageContexts.find((pageContext) => pageContext.url === url)) {
          // Not sure if there is a use case for it, but why not allowing users to use a `prerender()` hook in order to provide some `pageContext` for a page with a static route
          return
        }

        const pageContext = {
          ...globalContext,
          _prerenderSourceFile: null,
          url,
          routeParams: {},
          _pageId: pageId,
        }
        objectAssign(pageContext, await loadPageFilesServer(pageContext))

        globalContext.prerenderPageContexts.push(pageContext)
      }),
    ),
  )
}

async function callOnBeforePrerenderHook(globalContext: {
  _pageFilesAll: PageFile[]
  prerenderPageContexts: PageContext[]
}) {
  const pageFilesServerDefault = globalContext._pageFilesAll.filter(
    (p) => p.fileType === '.page.server' && p.isDefaultPageFile,
  )
  await Promise.all(pageFilesServerDefault.map((p) => p.loadFileExports?.()))
  const hooks = pageFilesServerDefault
    .filter((p) => p.fileExports?.onBeforePrerender)
    .map((p) => ({ filePath: p.filePath, onBeforePrerender: p.fileExports!.onBeforePrerender }))
  if (hooks.length === 0) {
    return
  }
  assertUsage(
    hooks.length === 1,
    'There can be only one `onBeforePrerender()` hook. If you need to be able to define several, open a new GitHub issue.',
  )
  const hook = hooks[0]!
  const { onBeforePrerender, filePath } = hook
  assertUsage(isCallable(onBeforePrerender), `\`export { onBeforePrerender }\` of ${filePath} should be a function.`)
  const result = await onBeforePrerender(globalContext)
  if (result === null || result === undefined) {
    return
  }
  const errPrefix = `The \`onBeforePrerender()\` hook exported by \`${filePath}\``
  assertUsage(
    isObjectWithKeys(result, ['globalContext'] as const) && hasProp(result, 'globalContext'),
    `${errPrefix} should return \`null\`, \`undefined\`, or a plain JavaScript object \`{ globalContext: { /* ... */ } }\`.`,
  )
  const globalContextAddedum = result.globalContext
  assertUsage(
    isPlainObject(globalContextAddedum),
    `${errPrefix} returned \`{ globalContext }\` but \`globalContext\` should be a plain JavaScript object.`,
  )
  objectAssign(globalContext, globalContextAddedum)
}

async function routeAndPrerender(
  globalContext: GlobalPrerenderingContext & { prerenderPageContexts: PageContext[] },
  htmlFiles: HtmlFile[],
  prerenderPageIds: PrerenderedPageIds,
  concurrencyLimit: pLimit.Limit,
  noExtraDir: boolean,
) {
  // Route all URLs
  await Promise.all(
    globalContext.prerenderPageContexts.map((pageContext) =>
      concurrencyLimit(async () => {
        const { url, _prerenderSourceFile: prerenderSourceFile } = pageContext
        const routeResult = await route(pageContext)
        if ('hookError' in routeResult) {
          throwPrerenderError(routeResult.hookError)
          assert(false)
        }
        assert(
          hasProp(routeResult.pageContextAddendum, '_pageId', 'null') ||
            hasProp(routeResult.pageContextAddendum, '_pageId', 'string'),
        )
        if (routeResult.pageContextAddendum._pageId === null) {
          // Is this assertion also true with a `onBeforeRoute()` hook?
          assert(prerenderSourceFile)
          assertUsage(
            false,
            `Your \`prerender()\` hook defined in \`${prerenderSourceFile}\ returns an URL \`${url}\` that doesn't match any page route. Make sure the URLs your return in your \`prerender()\` hooks always match the URL of a page.`,
          )
        }

        assert(routeResult.pageContextAddendum._pageId)
        objectAssign(pageContext, routeResult.pageContextAddendum)
        const { _pageId: pageId } = pageContext

        const pageFilesData = await loadPageFilesServer({
          ...globalContext,
          _pageId: pageId,
        })
        objectAssign(pageContext, pageFilesData)

        const { documentHtml, pageContextSerialized } = await prerenderPage(pageContext)
        htmlFiles.push({
          url,
          pageContext,
          htmlString: documentHtml,
          pageContextSerialized,
          doNotCreateExtraDirectory: noExtraDir,
          pageId,
        })
        prerenderPageIds[pageId] = pageContext
      }),
    ),
  )
}

function warnContradictoryNoPrerenderList(
  prerenderPageIds: Record<string, { url: string; _prerenderSourceFile: string | null }>,
  doNotPrerenderList: DoNotPrerenderList,
) {
  Object.entries(prerenderPageIds).forEach(([pageId, { url, _prerenderSourceFile }]) => {
    const doNotPrerenderListHit = doNotPrerenderList.find((p) => p.pageId === pageId)
    if (doNotPrerenderListHit) {
      assert(_prerenderSourceFile)
      assertUsage(
        false,
        `Your \`prerender()\` hook defined in ${_prerenderSourceFile} returns the URL \`${url}\` which matches the page with \`${doNotPrerenderListHit?.pageServerFilePath}#doNotPrerender === true\`. This is contradictory: either do not set \`doNotPrerender\` or remove the URL from the list of URLs to be pre-rendered.`,
      )
    }
  })
}

function warnMissingPages(
  prerenderPageIds: Record<string, unknown>,
  doNotPrerenderList: DoNotPrerenderList,
  globalContext: { _allPageIds: string[] },
  partial: boolean,
) {
  globalContext._allPageIds
    .filter((pageId) => !prerenderPageIds[pageId])
    .filter((pageId) => !doNotPrerenderList.find((p) => p.pageId === pageId))
    .filter((pageId) => !isErrorPage(pageId))
    .forEach((pageId) => {
      assertWarning(
        partial,
        `Could not pre-render page \`${pageId}.page.*\` because it has a non-static route, and no \`prerender()\` hook returned (an) URL(s) matching the page's route. Either use a \`prerender()\` hook to pre-render the page, or use the \`--partial\` option to suppress this warning.`,
      )
    })
}

async function prerender404Page(htmlFiles: HtmlFile[], globalContext: GlobalPrerenderingContext) {
  if (!htmlFiles.find(({ url }) => url === '/404')) {
    const result = await renderStatic404Page(globalContext)
    if (result) {
      const url = '/404'
      const { documentHtml, pageContext } = result
      htmlFiles.push({
        url,
        pageContext,
        htmlString: documentHtml,
        pageContextSerialized: null,
        doNotCreateExtraDirectory: true,
        pageId: null,
      })
    }
  }
}

async function writeHtmlFile(
  { url, pageContext, htmlString, pageContextSerialized, doNotCreateExtraDirectory, pageId }: HtmlFile,
  root: string,
  outDir: string,
  doNotPrerenderList: DoNotPrerenderList,
  concurrencyLimit: pLimit.Limit,
  onPagePrerender: Function | null,
) {
  assert(url.startsWith('/'))
  assert(!doNotPrerenderList.find((p) => p.pageId === pageId))

  const writeJobs = [
    write(
      url,
      pageContext,
      '.html',
      htmlString,
      root,
      outDir,
      doNotCreateExtraDirectory,
      concurrencyLimit,
      onPagePrerender,
    ),
  ]
  if (pageContextSerialized !== null) {
    writeJobs.push(
      write(
        url,
        pageContext,
        '.pageContext.json',
        pageContextSerialized,
        root,
        outDir,
        doNotCreateExtraDirectory,
        concurrencyLimit,
        onPagePrerender,
      ),
    )
  }
  await Promise.all(writeJobs)
}

function write(
  url: string,
  pageContext: Record<string, unknown>,
  fileExtension: '.html' | '.pageContext.json',
  fileContent: string,
  root: string,
  outDir: string,
  doNotCreateExtraDirectory: boolean,
  concurrencyLimit: pLimit.Limit,
  onPagePrerender: Function | null,
) {
  return concurrencyLimit(async () => {
    const fileUrl = getFileUrl(url, fileExtension, fileExtension === '.pageContext.json' || doNotCreateExtraDirectory)
    assert(fileUrl.startsWith('/'))
    const filePathRelative = fileUrl.slice(1).split('/').join(sep)
    assert(!filePathRelative.startsWith(sep))
    const filePath = join(root, outDir, 'client', filePathRelative)
    if (onPagePrerender) {
      objectAssign(pageContext, {
        _prerenderResult: {
          filePath,
          fileContent,
        },
      })
      await onPagePrerender(pageContext)
    } else {
      const { promises } = require('fs')
      const { writeFile, mkdir } = promises
      await mkdir(dirname(filePath), { recursive: true })
      await writeFile(filePath, fileContent)
      console.log(`${gray(join(outDir, 'client') + sep)}${blue(filePathRelative)}`)
    }
  })
}

function normalizePrerenderResult(
  prerenderResult: unknown,
  prerenderSourceFile: string,
): { url: string; pageContext: null | Record<string, unknown> }[] {
  if (Array.isArray(prerenderResult)) {
    return prerenderResult.map(normalize)
  } else {
    return [normalize(prerenderResult)]
  }

  function normalize(prerenderElement: unknown): { url: string; pageContext: null | Record<string, unknown> } {
    if (typeof prerenderElement === 'string') return { url: prerenderElement, pageContext: null }

    const errMsg1 = `The \`prerender()\` hook defined in \`${prerenderSourceFile}\` returned an invalid value`
    const errMsg2 =
      'Make sure your `prerender()` hook returns an object `{ url, pageContext }` or an array of such objects.'
    assertUsage(isPlainObject(prerenderElement), `${errMsg1}. ${errMsg2}`)
    assertUsage(hasProp(prerenderElement, 'url'), `${errMsg1}: \`url\` is missing. ${errMsg2}`)
    assertUsage(
      hasProp(prerenderElement, 'url', 'string'),
      `${errMsg1}: \`url\` should be a string (but we got \`typeof url === "${typeof prerenderElement.url}"\`).`,
    )
    assertUsage(
      prerenderElement.url.startsWith('/'),
      `${errMsg1}: the \`url\` with value \`${prerenderElement.url}\` doesn't start with \`/\`. Make sure each URL starts with \`/\`.`,
    )
    Object.keys(prerenderElement).forEach((key) => {
      assertUsage(key === 'url' || key === 'pageContext', `${errMsg1}: unexpected object key \`${key}\` ${errMsg2}`)
    })
    if (!hasProp(prerenderElement, 'pageContext')) {
      prerenderElement['pageContext'] = null
    }
    assertUsage(
      hasProp(prerenderElement, 'pageContext', 'object'),
      `The \`prerender()\` hook exported by ${prerenderSourceFile} returned an invalid \`pageContext\` value: make sure \`pageContext\` is a plain JavaScript object.`,
    )
    return prerenderElement
  }
}

function assertPluginManifest(
  pluginManifest: PluginManifest | null,
  pluginManifestPath: string,
  outDirPath: string,
): asserts pluginManifest is PluginManifest {
  assertUsage(
    pluginManifest,
    "You are trying to run `$ vite-plugin-ssr prerender` but you didn't build your app yet: make sure to run `$ vite build && vite build --ssr` before running the pre-rendering. (Following build manifest is missing: `" +
      pluginManifestPath +
      '`.)',
  )

  assert(typeof pluginManifest.version === 'string')
  assertUsage(
    pluginManifest.version === projectInfo.projectVersion,
    `Remove ${outDirPath} and re-build your app \`$ vite build && vite build --ssr && vite-plugin-ssr prerender\`. (You are using \`vite-plugin-ssr@${projectInfo.projectVersion}\` but your build has been generated with following different version \`vite-plugin-ssr@${pluginManifest.version}\`.)`,
  )
  assert(typeof pluginManifest.base === 'string')
  assert(typeof pluginManifest.usesClientRouter === 'boolean')
}

function assertArguments({
  partial,
  noExtraDir,
  base,
  root,
  outDir,
  parallel,
}: {
  partial: unknown
  noExtraDir: unknown
  base: unknown
  root: unknown
  outDir: unknown
  parallel: number
}) {
  assertUsage(partial === true || partial === false, '[prerender()] Option `partial` should be a boolean.')
  assertUsage(noExtraDir === true || noExtraDir === false, '[prerender()] Option `noExtraDir` should be a boolean.')
  assertWarning(base === undefined, '[prerender()] Option `base` is deprecated and has no-effect.')
  assertUsage(typeof root === 'string', '[prerender()] Option `root` should be a string.')
  assertUsage(isAbsolute(root), '[prerender()] The path `root` is not absolute. Make sure to provide an absolute path.')
  assertUsage(typeof outDir === 'string', '[prerender()] Option `outDir` should be a string.')
  assertUsage(parallel, `[prerender()] Option \`parallel\` should be a number \`>=1\` but we got \`${parallel}\`.`)
}

function setProductionEnvVar() {
  // The statement `process.env['NODE_ENV'] = 'production'` chokes webpack v4 (which Cloudflare Workers uses)
  const proc = process
  const { env } = proc
  env['NODE_ENV'] = 'production'
}
