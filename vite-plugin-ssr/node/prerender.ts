import './page-files/setup'
import fs from 'fs'
const { writeFile, mkdir } = fs.promises
import { join, sep, dirname, isAbsolute } from 'path'
import { isErrorPage, isStaticRoute, route } from '../shared/route'
import {
  assert,
  assertUsage,
  assertWarning,
  hasProp,
  getFileUrl,
  isPlainObject,
  projectInfo,
  objectAssign
} from '../shared/utils'
import { moduleExists } from '../shared/utils/moduleExists'
import { setSsrEnv } from './ssrEnv'
import { getGlobalContext, loadPageFiles, prerenderPage, renderStatic404Page } from './renderPage'
import { blue, green, gray, cyan } from 'kolorist'
import pLimit from 'p-limit'
import { cpus } from 'os'

export { prerender }

type HtmlDocument = {
  url: string
  htmlDocument: string
  pageContextSerialized: string | null
  doNotCreateExtraDirectory: boolean
  pageId: string | null
}

type DoNotPrerenderList = { pageId: string; pageServerFilePath: string }[]

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

  const { pluginManifest, pluginManifestPath } = getPluginManifest(root)
  assertUsage(
    pluginManifest !== null,
    "You are trying to run `$ vite-plugin-ssr prerender` but you didn't build your app yet: make sure to run `$ vite build && vite build --ssr` before running the pre-rendering. (Following build manifest is missing: `" +
      pluginManifestPath +
      '`.)'
  )
  assertUsage(
    pluginManifest.version === projectInfo.version,
    `Remove \`dist/\` and re-build your app \`$ vite build && vite build --ssr && vite-plugin-ssr prerender\`. (You are using \`vite-plugin-ssr@${projectInfo.version}\` but your build has been generated with a different version \`vite-plugin-ssr@${pluginManifest.version}\`.)`
  )
  const _serializedPageContextClientNeeded: boolean = pluginManifest.doesClientSideRouting
  const baseUrl: string = pluginManifest.base

  process.env.NODE_ENV = 'production'
  setSsrEnv({
    isProduction: true,
    root,
    viteDevServer: undefined,
    baseUrl
  })

  const globalContext = await getGlobalContext()
  objectAssign(globalContext, { _isPreRendering: true as const })

  const doNotPrerenderList: DoNotPrerenderList = []

  // Concurrency limit
  const limit = pLimit(parallel)

  const pageContextList: Record<
    string,
    {
      url: string
      _prerenderSourceFile: string
      _pageContextAlreadyProvidedByPrerenderHook: boolean
    }
  > = {}
  await Promise.all(
    globalContext._allPageIds
      .filter((pageId) => !isErrorPage(pageId))
      .map((pageId) =>
        limit(async () => {
          const pageFilesData = await loadPageFiles({
            ...globalContext,
            _pageId: pageId
          })
          assert('_pageServerFile' in pageFilesData)

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
            if (!('url' in pageContextList)) {
              pageContextList[url] = {
                _prerenderSourceFile: prerenderSourceFile,
                url,
                _pageContextAlreadyProvidedByPrerenderHook: !!pageContext,
                ...pageContext
              }
            } else {
              if (pageContext) {
                Object.assign(pageContextList[url], pageContext)
                pageContextList[url]._pageContextAlreadyProvidedByPrerenderHook = true
              }
            }
            assert(pageContextList[url].url === url)
          })
        })
      )
  )

  const prerenderPageContexts = Object.values(pageContextList).map((pageContext) => {
    objectAssign(pageContext, {
      ...globalContext,
      _serializedPageContextClientNeeded,
      urlNormalized: pageContext.url
    })
    return pageContext
  })
  objectAssign(globalContext, {
    _prerenderPageContexts: prerenderPageContexts
  })

  const htmlDocuments: HtmlDocument[] = []
  const alreadyIncluded: Record<string, true> = {}

  // Render URLs renturned by `prerender()` hooks
  await Promise.all(
    globalContext._prerenderPageContexts.map((pageContext) =>
      limit(async () => {
        const { url, _prerenderSourceFile: prerenderSourceFile } = pageContext
        const pageContextRouteAddendum = await route(pageContext)
        assert(pageContextRouteAddendum === null || isPlainObject(pageContextRouteAddendum))
        assertUsage(
          pageContextRouteAddendum !== null,
          `Your \`prerender()\` hook defined in \`${prerenderSourceFile}\ returns an URL \`${url}\` that doesn't match any page route. Make sure the URLs your return in your \`prerender()\` hooks always match the URL of a page.`
        )

        objectAssign(pageContext, pageContextRouteAddendum)
        const { _pageId: pageId } = pageContext

        const doNotPrerenderListHit = doNotPrerenderList.find((p) => p.pageId === pageId)
        assertUsage(
          !doNotPrerenderListHit,
          `Your \`prerender()\` hook defined in ${prerenderSourceFile} returns the URL \`${url}\` which matches the page with \`${doNotPrerenderListHit?.pageServerFilePath}#doNotPrerender === true\`. This is contradictory: either do not set \`doNotPrerender\` or remove the URL from the list of URLs to be pre-rendered.`
        )

        const { htmlDocument, pageContextSerialized } = await prerenderPage(pageContext)
        htmlDocuments.push({ url, htmlDocument, pageContextSerialized, doNotCreateExtraDirectory: noExtraDir, pageId })
        alreadyIncluded[pageId] = true
      })
    )
  )

  // Render pages that have a static route
  await Promise.all(
    globalContext._pageRoutes
      .filter(({ pageId }) => !alreadyIncluded[pageId])
      .map((pageRoute) =>
        limit(async () => {
          const { pageId } = pageRoute
          let url
          if (pageRoute.pageRouteFile) {
            const { routeValue } = pageRoute.pageRouteFile
            if (typeof routeValue === 'string' && isStaticRoute(routeValue)) {
              assert(routeValue.startsWith('/'))
              url = routeValue
            } else {
              assertWarning(
                partial,
                `Cannot pre-render page \`${pageId}.page.*\` because it has a non-static route, and no \`prerender()\` hook returned (an) URL(s) matching the page's route. Use the --partial option to suppress this warning.`
              )
              return
            }
          } else {
            url = pageRoute.filesystemRoute
          }
          assert(url.startsWith('/'))

          const pageContext = {
            ...globalContext,
            url,
            routeParams: {},
            _pageId: pageId,
            _serializedPageContextClientNeeded,
            _pageContextAlreadyProvidedByPrerenderHook: false
          }

          const { htmlDocument, pageContextSerialized } = await prerenderPage(pageContext)
          htmlDocuments.push({
            url,
            htmlDocument,
            pageContextSerialized,
            doNotCreateExtraDirectory: noExtraDir,
            pageId
          })
        })
      )
  )

  if (!htmlDocuments.find(({ url }) => url === '/404')) {
    const result = await renderStatic404Page(globalContext)
    if (result) {
      const url = '/404'
      const { htmlDocument } = result
      htmlDocuments.push({
        url,
        htmlDocument,
        pageContextSerialized: null,
        doNotCreateExtraDirectory: true,
        pageId: null
      })
    }
  }

  console.log(`${green(`✓`)} ${htmlDocuments.length} HTML documents pre-rendered.`)

  // `htmlDocuments.length` can be very big; to avoid `EMFILE, too many open files` we don't parallelize the writing
  for (const htmlDoc of htmlDocuments) {
    await writeHtmlDocument(htmlDoc, root, doNotPrerenderList, limit)
  }
}

async function writeHtmlDocument(
  { url, htmlDocument, pageContextSerialized, doNotCreateExtraDirectory, pageId }: HtmlDocument,
  root: string,
  doNotPrerenderList: DoNotPrerenderList,
  limit: pLimit.Limit
) {
  assert(url.startsWith('/'))
  assert(!doNotPrerenderList.find((p) => p.pageId === pageId))

  const writeJobs = [write(url, '.html', htmlDocument, root, doNotCreateExtraDirectory, limit)]
  if (pageContextSerialized !== null) {
    writeJobs.push(write(url, '.pageContext.json', pageContextSerialized, root, doNotCreateExtraDirectory, limit))
  }
  await Promise.all(writeJobs)
}

function write(
  url: string,
  fileExtension: '.html' | '.pageContext.json',
  fileContent: string,
  root: string,
  doNotCreateExtraDirectory: boolean,
  limit: pLimit.Limit
) {
  return limit(async () => {
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
      prerenderElement.pageContext = null
    }
    assertUsage(
      hasProp(prerenderElement, 'pageContext', 'object'),
      `The \`prerender()\` hook exported by ${prerenderSourceFile} returned an invalid \`pageContext\` value: make sure \`pageContext\` is a plain JavaScript object.`
    )
    return prerenderElement
  }
}

type PluginManifest = {
  version: string
  base: string
  doesClientSideRouting: boolean
}
function getPluginManifest(root: string): {
  pluginManifest: PluginManifest | null
  pluginManifestPath: string
} {
  const pluginManifestPath = `${root}/dist/client/vite-plugin-ssr.json`
  if (!moduleExists(pluginManifestPath)) {
    return { pluginManifest: null, pluginManifestPath }
  }

  let manifestContent: unknown = require(pluginManifestPath)
  assert(hasProp(manifestContent, 'version'))
  assert(hasProp(manifestContent, 'base'))
  assert(hasProp(manifestContent, 'doesClientSideRouting'))
  const { base, doesClientSideRouting } = manifestContent
  assert(typeof doesClientSideRouting === 'boolean')
  assert(typeof base === 'string')

  const pluginManifest = { version: projectInfo.version, base, doesClientSideRouting }
  return { pluginManifest, pluginManifestPath }
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
