import './page-files/setup'
import { promises } from 'fs'
const { writeFile, mkdir } = promises
import { join, sep, dirname, isAbsolute } from 'path'
import { isErrorPage, isStaticRoute, PageRoutes, route } from '../shared/route'
import {
  assert,
  assertUsage,
  assertWarning,
  hasProp,
  getFileUrl,
  isPlainObject,
  projectInfo,
  objectAssign,
  isObjectWithKeys
} from '../shared/utils'
import { moduleExists } from '../shared/utils/moduleExists'
import { setSsrEnv } from './ssrEnv'
import {
  getGlobalContext,
  GlobalContext,
  loadOnBeforePrerenderHook,
  loadPageFiles,
  prerenderPage,
  renderStatic404Page
} from './renderPage'
import { blue, green, gray, cyan } from 'kolorist'
import * as pLimit from 'p-limit'
import { cpus } from 'os'
import { AllPageFiles } from '../shared/getPageFiles'

export { prerender }

type HtmlFile = {
  url: string
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
 * @param root The root directory of your project (where `vite.config.js` and `dist/` live) (default: `process.cwd()`).
 */
async function prerender({
  partial = false,
  noExtraDir = false,
  root = process.cwd(),
  clientRouter = false,
  parallel = cpus().length,
  base
}: {
  partial?: boolean
  noExtraDir?: boolean
  root?: string
  clientRouter?: boolean
  base?: string
  parallel?: number
} = {}) {
  assertArguments(partial, noExtraDir, clientRouter, base, root, parallel)
  console.log(`${cyan(`vite-plugin-ssr ${projectInfo.version}`)} ${green('pre-rendering HTML...')}`)

  const pluginManifest = getPluginManifest(root)

  process.env['NODE_ENV'] = 'production'
  setSsrEnv({
    isProduction: true,
    root,
    viteDevServer: undefined,
    baseUrl: pluginManifest.base
  })

  const concurrencyLimit = pLimit(parallel)

  const globalContext = await getGlobalContext()
  objectAssign(globalContext, {
    _isPreRendering: true as const,
    _usesClientRouter: pluginManifest.usesClientRouter,
    prerenderPageContexts: [] as PageContext[]
  })

  const doNotPrerenderList: DoNotPrerenderList = []

  await callPrerenderHooks(globalContext, doNotPrerenderList, concurrencyLimit)

  await handlePagesWithStaticRoutes(globalContext, doNotPrerenderList, concurrencyLimit)

  await callOnBeforePrerenderHook(globalContext)

  const prerenderPageIds: PrerenderedPageIds = {}
  const htmlFiles: HtmlFile[] = []
  await routeAndPrerender(globalContext, htmlFiles, prerenderPageIds, concurrencyLimit, noExtraDir)

  warnContradictoryNoPrerenderList(prerenderPageIds, doNotPrerenderList)

  await prerender404Page(htmlFiles, globalContext)

  console.log(`${green(`✓`)} ${htmlFiles.length} HTML documents pre-rendered.`)

  await Promise.all(htmlFiles.map((htmlFile) => writeHtmlFile(htmlFile, root, doNotPrerenderList, concurrencyLimit)))

  warnMissingPages(prerenderPageIds, doNotPrerenderList, globalContext, partial)
}

async function callPrerenderHooks(
  globalContext: GlobalPrerenderingContext,
  doNotPrerenderList: DoNotPrerenderList,
  concurrencyLimit: pLimit.Limit
) {
  // Render URLs returned by `prerender()` hooks
  await Promise.all(
    globalContext._allPageIds
      .filter((pageId) => !isErrorPage(pageId))
      .map((pageId) =>
        concurrencyLimit(async () => {
          const pageFilesData = await loadPageFiles({
            ...globalContext,
            _pageId: pageId
          })
          const pageServerFile = pageFilesData._pageServerFile
          if (!pageServerFile) return

          const { fileExports, filePath } = pageServerFile

          if (fileExports.doNotPrerender) {
            doNotPrerenderList.push({ pageId, pageServerFilePath: filePath })
            return
          }

          const prerenderFunction = fileExports.prerender
          if (!prerenderFunction) return
          const prerenderSourceFile = filePath
          assert(prerenderSourceFile)

          const prerenderResult = await prerenderFunction()
          const result = normalizePrerenderResult(prerenderResult, prerenderSourceFile)

          result.forEach(({ url, pageContext }) => {
            assert(typeof url === 'string')
            assert(url.startsWith('/'))
            assert(pageContext === null || isPlainObject(pageContext))
            let pageContextFound: PageContext | undefined = globalContext.prerenderPageContexts.find(
              (pageContext) => pageContext.url === url
            )
            if (!pageContextFound) {
              pageContextFound = {
                ...globalContext,
                _prerenderSourceFile: prerenderSourceFile,
                url
              }
              globalContext.prerenderPageContexts.push(pageContextFound)
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
  concurrencyLimit: pLimit.Limit
) {
  // Pre-render pages with a static route
  await Promise.all(
    globalContext._pageRoutes.map((pageRoute) =>
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
          _pageId: pageId
        }
        objectAssign(pageContext, await loadPageFiles(pageContext))

        globalContext.prerenderPageContexts.push(pageContext)
      })
    )
  )
}

async function callOnBeforePrerenderHook(globalContext: {
  _allPageFiles: AllPageFiles
  prerenderPageContexts: PageContext[]
  _pageRoutes: PageRoutes
}) {
  const hook = await loadOnBeforePrerenderHook(globalContext)
  if (!hook) {
    return
  }
  const { onBeforePrerenderHook, hookFilePath } = hook
  const result = await onBeforePrerenderHook(globalContext)
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
}

async function routeAndPrerender(
  globalContext: GlobalPrerenderingContext & { prerenderPageContexts: PageContext[] },
  htmlFiles: HtmlFile[],
  prerenderPageIds: PrerenderedPageIds,
  concurrencyLimit: pLimit.Limit,
  noExtraDir: boolean
) {
  // Route all URLs
  await Promise.all(
    globalContext.prerenderPageContexts.map((pageContext) =>
      concurrencyLimit(async () => {
        const { url, _prerenderSourceFile: prerenderSourceFile } = pageContext
        const pageContextRouteAddendum = await route(pageContext)
        assert(
          hasProp(pageContextRouteAddendum, '_pageId', 'null') || hasProp(pageContextRouteAddendum, '_pageId', 'string')
        )
        if (pageContextRouteAddendum._pageId === null) {
          assert(prerenderSourceFile)
          assertUsage(
            false,
            `Your \`prerender()\` hook defined in \`${prerenderSourceFile}\ returns an URL \`${url}\` that doesn't match any page route. Make sure the URLs your return in your \`prerender()\` hooks always match the URL of a page.`
          )
        }

        assert(pageContextRouteAddendum._pageId)
        objectAssign(pageContext, pageContextRouteAddendum)
        const { _pageId: pageId } = pageContext

        const pageFilesData = await loadPageFiles({
          ...globalContext,
          _pageId: pageId
        })
        objectAssign(pageContext, pageFilesData)

        const { documentHtml, pageContextSerialized } = await prerenderPage(pageContext)
        htmlFiles.push({
          url,
          htmlString: documentHtml,
          pageContextSerialized,
          doNotCreateExtraDirectory: noExtraDir,
          pageId
        })
        prerenderPageIds[pageId] = pageContext
      })
    )
  )
}

function warnContradictoryNoPrerenderList(
  prerenderPageIds: Record<string, { url: string; _prerenderSourceFile: string | null }>,
  doNotPrerenderList: DoNotPrerenderList
) {
  Object.entries(prerenderPageIds).forEach(([pageId, { url, _prerenderSourceFile }]) => {
    const doNotPrerenderListHit = doNotPrerenderList.find((p) => p.pageId === pageId)
    if (doNotPrerenderListHit) {
      assert(_prerenderSourceFile)
      assertUsage(
        false,
        `Your \`prerender()\` hook defined in ${_prerenderSourceFile} returns the URL \`${url}\` which matches the page with \`${doNotPrerenderListHit?.pageServerFilePath}#doNotPrerender === true\`. This is contradictory: either do not set \`doNotPrerender\` or remove the URL from the list of URLs to be pre-rendered.`
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
    .filter((pageId) => !isErrorPage(pageId))
    .forEach((pageId) => {
      assertWarning(
        partial,
        `Could not pre-render page \`${pageId}.page.*\` because it has a non-static route, and no \`prerender()\` hook returned (an) URL(s) matching the page's route. Either use a \`prerender()\` hook to pre-render the page, or use the \`--partial\` option to suppress this warning.`
      )
    })
}

async function prerender404Page(htmlFiles: HtmlFile[], globalContext: GlobalPrerenderingContext) {
  if (!htmlFiles.find(({ url }) => url === '/404')) {
    const result = await renderStatic404Page(globalContext)
    if (result) {
      const url = '/404'
      const { documentHtml } = result
      htmlFiles.push({
        url,
        htmlString: documentHtml,
        pageContextSerialized: null,
        doNotCreateExtraDirectory: true,
        pageId: null
      })
    }
  }
}

async function writeHtmlFile(
  { url, htmlString, pageContextSerialized, doNotCreateExtraDirectory, pageId }: HtmlFile,
  root: string,
  doNotPrerenderList: DoNotPrerenderList,
  concurrencyLimit: pLimit.Limit
) {
  assert(url.startsWith('/'))
  assert(!doNotPrerenderList.find((p) => p.pageId === pageId))

  const writeJobs = [write(url, '.html', htmlString, root, doNotCreateExtraDirectory, concurrencyLimit)]
  if (pageContextSerialized !== null) {
    writeJobs.push(
      write(url, '.pageContext.json', pageContextSerialized, root, doNotCreateExtraDirectory, concurrencyLimit)
    )
  }
  await Promise.all(writeJobs)
}

function write(
  url: string,
  fileExtension: '.html' | '.pageContext.json',
  fileContent: string,
  root: string,
  doNotCreateExtraDirectory: boolean,
  concurrencyLimit: pLimit.Limit
) {
  return concurrencyLimit(async () => {
    const fileUrl = getFileUrl(url, fileExtension, fileExtension === '.pageContext.json' || doNotCreateExtraDirectory)
    assert(fileUrl.startsWith('/'))
    const filePathRelative = fileUrl.slice(1).split('/').join(sep)
    assert(!filePathRelative.startsWith(sep))
    const filePath = join(root, 'dist', 'client', filePathRelative)
    await mkdirp(dirname(filePath))
    await writeFile(filePath, fileContent)
    console.log(`${gray(join('dist', 'client') + sep)}${blue(filePathRelative)}`)
  })
}

function mkdirp(path: string): Promise<string | undefined> {
  return mkdir(path, { recursive: true })
}

function normalizePrerenderResult(
  prerenderResult: unknown,
  prerenderSourceFile: string
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
      `The \`prerender()\` hook exported by ${prerenderSourceFile} returned an invalid \`pageContext\` value: make sure \`pageContext\` is a plain JavaScript object.`
    )
    return prerenderElement
  }
}

function getPluginManifest(root: string): {
  version: string
  base: string
  usesClientRouter: boolean
} {
  const pluginManifestPath = `${root}/dist/client/vite-plugin-ssr.json`
  assertUsage(
    moduleExists(pluginManifestPath),
    "You are trying to run `$ vite-plugin-ssr prerender` but you didn't build your app yet: make sure to run `$ vite build && vite build --ssr` before running the pre-rendering. (Following build manifest is missing: `" +
      pluginManifestPath +
      '`.)'
  )

  let manifestContent: unknown = require(pluginManifestPath)
  assert(hasProp(manifestContent, 'version'))
  assert(hasProp(manifestContent, 'base'))
  assert(hasProp(manifestContent, 'usesClientRouter'))
  const { base, usesClientRouter } = manifestContent
  assert(typeof usesClientRouter === 'boolean')
  assert(typeof base === 'string')

  const pluginManifest = { version: projectInfo.version, base, usesClientRouter }

  assertUsage(
    pluginManifest.version === projectInfo.version,
    `Remove \`dist/\` and re-build your app \`$ vite build && vite build --ssr && vite-plugin-ssr prerender\`. (You are using \`vite-plugin-ssr@${projectInfo.version}\` but your build has been generated with a different version \`vite-plugin-ssr@${pluginManifest.version}\`.)`
  )
  return pluginManifest
}

function assertArguments(
  partial: unknown,
  noExtraDir: unknown,
  clientRouter: unknown,
  base: unknown,
  root: unknown,
  parallel: number
) {
  assertUsage(partial === true || partial === false, '[prerender()] Option `partial` should be a boolean.')
  assertUsage(noExtraDir === true || noExtraDir === false, '[prerender()] Option `noExtraDir` should be a boolean.')
  assertWarning(clientRouter === false, '[prerender()] Option `clientRouter` is deprecated and has no-effect.')
  assertWarning(base === undefined, '[prerender()] Option `base` is deprecated and has no-effect.')
  assertUsage(typeof root === 'string', '[prerender()] Option `root` should be a string.')
  assertUsage(isAbsolute(root), '[prerender()] The path `root` is not absolute. Make sure to provide an absolute path.')
  assertUsage(parallel, '[prerender()] Option `parallel` should be a number `>=1`.')
}
