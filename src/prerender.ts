import './page-files/setup.node'
import fs from 'fs'
const { writeFile, mkdir } = fs.promises
import { join, sep, dirname } from 'path'
import { getFilesystemRoute, getPageIds, isErrorPage, isStaticRoute, loadPageRoutes, route } from './route.shared'
import { assert, assertUsage, assertWarning, hasProp, getFileUrl, moduleExists } from './utils'
import { setSsrEnv } from './ssrEnv.node'
import { getPageFunctions, prerenderPage } from './renderPage.node'
import { blue, green, gray, cyan } from 'kolorist'
import { version } from './package.json'

export { prerender }

type HtmlDocument = {
  url: string
  htmlDocument: string
  contextPropsSerialized: string | null
}

/**
 * Render your pages (e.g. for deploying to a static host).
 * @param partial Allow only a subset of pages to be pre-rendered.
 * @param root The root directory of your project (where `vite.config.js` and `dist/` live) (default: `process.cwd()`).
 */
async function prerender({
  partial = false,
  root = process.cwd(),
  clientRouter = false,
  base
}: {
  partial?: boolean
  root?: string
  clientRouter?: boolean
  base?: string
} = {}) {
  assertArguments(partial, clientRouter, base)
  console.log(`${cyan(`vite-plugin-ssr ${version}`)} ${green('pre-rendering HTML...')}`)

  const { pluginManifest, pluginManifestPath } = getPluginManifest(root)
  assertUsage(
    pluginManifest !== null,
    "You are trying to run `$ vite-plugin-ssr prerender` but you didn't build your app yet: make sure to run `$ vite build && vite build --ssr` before running the pre-rendering. (Following build manifest is missing: `" +
      pluginManifestPath +
      '`.)'
  )
  assertUsage(
    pluginManifest.version === version,
    `Remove \`dist/\` and re-build your app \`$ vite build && vite build --ssr && vite-plugin-ssr prerender\`. (You are using \`vite-plugin-ssr@${version}\` but your build has been generated with a different version \`vite-plugin-ssr@${pluginManifest.version}\`.)`
  )
  const contextPropsNeeded: boolean = pluginManifest.doesClientSideRouting
  const baseUrl: string = pluginManifest.base

  process.env.NODE_ENV = 'production'
  setSsrEnv({
    isProduction: true,
    root,
    viteDevServer: undefined,
    baseUrl
  })

  const allPageIds = (await getPageIds()).filter((pageId) => !isErrorPage(pageId))
  const pageRoutes = await loadPageRoutes()

  const prerenderData: Record<
    string,
    {
      prerenderSourceFile: string
      contextProps: Record<string, unknown>
      noPrenderContextProps: boolean
    }
  > = {}
  await Promise.all(
    allPageIds.map(async (pageId) => {
      const { prerenderFunction } = await getPageFunctions(pageId)
      if (!prerenderFunction) return
      const prerenderSourceFile = prerenderFunction.filePath
      const prerenderResult = await prerenderFunction.prerender()
      const result = normalizePrerenderResult(prerenderResult, prerenderSourceFile)
      result.forEach(({ url, contextProps }) => {
        assert(typeof url === 'string')
        assert(url.startsWith('/'))
        assert(contextProps === null || contextProps.constructor === Object)
        if (!('url' in prerenderData)) {
          prerenderData[url] = {
            contextProps: { url },
            noPrenderContextProps: true,
            prerenderSourceFile
          }
        }
        if (contextProps) {
          prerenderData[url].noPrenderContextProps = false
          prerenderData[url].contextProps = {
            ...prerenderData[url].contextProps,
            ...contextProps
          }
        }
      })
    })
  )

  const htmlDocuments: HtmlDocument[] = []
  const renderedPageIds: Record<string, true> = {}

  // Render URLs renturned by `prerender()` hooks
  await Promise.all(
    Object.entries(prerenderData).map(async ([url, { contextProps, prerenderSourceFile, noPrenderContextProps }]) => {
      const routeResult = await route(url, allPageIds, contextProps)
      assertUsage(
        routeResult,
        `The \`prerender()\` hook defined in \`${prerenderSourceFile}\ returns an URL \`${url}\` that doesn't match any page route. Make sure the URLs returned by \`prerender()\` hooks to always match the URL of a page.`
      )
      const { pageId } = routeResult
      const { htmlDocument, contextPropsSerialized } = await prerenderPage(
        pageId,
        { ...contextProps, ...routeResult.contextPropsAddendum },
        url,
        !noPrenderContextProps,
        contextPropsNeeded
      )
      htmlDocuments.push({ url, htmlDocument, contextPropsSerialized })
      renderedPageIds[pageId] = true
    })
  )

  // Render pages that have a static route
  await Promise.all(
    allPageIds
      .filter((pageId) => !renderedPageIds[pageId])
      .map(async (pageId) => {
        let url
        const contextProps = {
          routeParams: {}
        }
        // Route with filesystem
        if (!(pageId in pageRoutes)) {
          url = getFilesystemRoute(pageId, allPageIds)
          assert(url.startsWith('/'))
        } else {
          const { pageRoute } = pageRoutes[pageId]
          if (typeof pageRoute === 'string' && isStaticRoute(pageRoute)) {
            assert(pageRoute.startsWith('/'))
            url = pageRoute
          } else {
            assertWarning(
              partial,
              `Cannot pre-render page \`${pageId}.page.*\` because it has a non-static route and no \`prerender()\` hook returned (an) URL(s) matching the page's route. Use the --partial option to suppress this warning.`
            )
            return
          }
        }
        const routeResult = await route(url, allPageIds, contextProps)

        Object.assign(contextProps, { url }, routeResult?.contextPropsAddendum)

        const { htmlDocument, contextPropsSerialized } = await prerenderPage(
          pageId,
          contextProps,
          url,
          false,
          contextPropsNeeded
        )
        htmlDocuments.push({ url, htmlDocument, contextPropsSerialized })
      })
  )
  console.log(`${green(`✓`)} ${htmlDocuments.length} HTML documents pre-rendered.`)

  await Promise.all(htmlDocuments.map((htmlDoc) => writeHtmlDocument(htmlDoc, root)))
}

async function writeHtmlDocument({ url, htmlDocument, contextPropsSerialized }: HtmlDocument, root: string) {
  assert(url.startsWith('/'))

  const writeJobs = [write(url, '.html', htmlDocument, root)]
  if (contextPropsSerialized !== null) {
    writeJobs.push(write(url, '.contextProps.json', contextPropsSerialized, root))
  }
  await Promise.all(writeJobs)
}

async function write(url: string, fileExtension: '.html' | '.contextProps.json', fileContent: string, root: string) {
  const fileUrl = getFileUrl(url, fileExtension)
  assert(fileUrl.startsWith('/'))
  const filePathRelative = fileUrl.slice(1).split('/').join(sep)
  assert(!filePathRelative.startsWith(sep))
  const filePath = join(root, 'dist', 'client', filePathRelative)
  await mkdirp(dirname(filePath))
  await writeFile(filePath, fileContent)
  console.log(`${gray(join('dist', 'client') + sep)}${blue(filePathRelative)}`)
}

function mkdirp(path: string): Promise<string | undefined> {
  return mkdir(path, { recursive: true })
}

function normalizePrerenderResult(
  prerenderResult: unknown,
  prerenderSourceFile: string
): { url: string; contextProps: null | Record<string, unknown> }[] {
  if (Array.isArray(prerenderResult)) {
    return prerenderResult.map(normalize)
  } else {
    return [normalize(prerenderResult)]
  }

  function normalize(prerenderElement: unknown): { url: string; contextProps: null | Record<string, unknown> } {
    if (typeof prerenderElement === 'string') return { url: prerenderElement, contextProps: null }

    const errMsg1 = `The \`prerender()\` hook defined in \`${prerenderSourceFile}\` returned an invalid value`
    const errMsg2 =
      'Make sure your `prerender()` hook returns an object `{url, contextProps}` or an array of such objects.'
    assertUsage(
      typeof prerenderElement === 'object' && prerenderElement !== null && prerenderElement.constructor === Object,
      `${errMsg1}. ${errMsg2}`
    )
    assertUsage(hasProp(prerenderElement, 'url'), `${errMsg1}: \`url\` is missing. ${errMsg2}`)
    assertUsage(
      typeof prerenderElement.url === 'string',
      `${errMsg1}: unexpected \`url\` of type \`${typeof prerenderElement.url}\`.`
    )
    assertUsage(
      prerenderElement.url.startsWith('/'),
      `${errMsg1}: the \`url\` with value \`${prerenderElement.url}\` doesn't start with \`/\`. Make sure each URL starts with \`/\`.`
    )
    Object.keys(prerenderElement).forEach((key) => {
      assertUsage(key === 'url' || key === 'contextProps', `${errMsg1}: unexpected object key \`${key}\` ${errMsg2}`)
    })
    if (!hasProp(prerenderElement, 'contextProps')) {
      prerenderElement = { ...prerenderElement, contextProps: null }
    }
    assertUsage(
      hasProp(prerenderElement, 'contextProps') &&
        typeof prerenderElement.contextProps === 'object' &&
        (prerenderElement.contextProps === null || prerenderElement.contextProps.constructor === Object),
      `The \`prerender()\` hook exported by ${prerenderSourceFile} returned invalid \`contextProps\`. Make sure all \`contextProps\` to be plain JavaScript object.`
    )
    return prerenderElement as any
  }
}

type PluginManifest = {
  version: string
  base: string
  doesClientSideRouting: boolean
}
function getPluginManifest(
  root: string
): {
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

  const pluginManifest = { version, base, doesClientSideRouting }
  return { pluginManifest, pluginManifestPath }
}

function assertArguments(partial: unknown, clientRouter: unknown, base: unknown) {
  assertUsage(partial === true || partial === false, '[prerender()] Option `partial` should be a boolean.')
  assertWarning(clientRouter === false, '[prerender()] Option `clientRouter` is deprecated and has no-effect.')
  assertWarning(base === undefined, '[prerender()] Option `base` is deprecated and has no-effect.')
}
