import './user-files/infra.node'
import { writeFile as writeFile_cb, mkdir } from 'fs'
import { join, sep, dirname } from 'path'
import {
  getFilesystemRoute,
  getPageIds,
  isErrorPage,
  isStaticRoute,
  loadPageRoutes,
  route
} from './route.node'
import { assert, assertUsage, assertWarning, hasProp } from './utils'
import { setSsrEnv } from './ssrEnv.node'
import { getPageFunctions, renderPageId } from './renderPage.node'
import { blue, green, gray, cyan } from 'kolorist'

export { prerender }

async function prerender(partial: undefined | boolean) {
  console.log(
    `${cyan(`vite-plugin-ssr ${require('../package.json').version}`)} ${green(
      'pre-rendering HTML...'
    )}`
  )

  process.env.NODE_ENV = 'production'
  const root = process.cwd()
  setSsrEnv({
    isProduction: true,
    root,
    viteDevServer: undefined
  })

  const allPageIds = (await getPageIds()).filter(
    (pageId) => !isErrorPage(pageId)
  )
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
      const result = normalizePrerenderResult(
        prerenderResult,
        prerenderSourceFile
      )
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

  const htmlFiles: { url: string; renderResult: string }[] = []
  const renderedPageIds: Record<string, true> = {}

  await Promise.all(
    Object.entries(prerenderData).map(
      async ([
        url,
        { contextProps, prerenderSourceFile, noPrenderContextProps }
      ]) => {
        const routeResult = await route(url, allPageIds, contextProps)
        assertUsage(
          routeResult,
          `The \`prerender()\` hook defined in \`${prerenderSourceFile}\ returns an URL \`${url}\` that doesn't match any page route. Make sure the URLs returned by \`prerender()\` hooks to always match the URL of a page.`
        )
        const { pageId } = routeResult
        const renderResult = await renderPageId(
          pageId,
          { ...contextProps, ...routeResult.contextPropsAddendum },
          url,
          !noPrenderContextProps
        )
        assertRenderResult(renderResult)
        htmlFiles.push({ url, renderResult })
        renderedPageIds[pageId] = true
      }
    )
  )

  await Promise.all(
    allPageIds
      .filter((pageId) => !renderedPageIds[pageId])
      .map(async (pageId) => {
        let url
        const contextProps = {}
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
        const renderResult = await renderPageId(pageId, contextProps, url)
        assertRenderResult(renderResult)
        htmlFiles.push({ url, renderResult })
      })
  )
  console.log(`${green(`✓`)} ${htmlFiles.length} HTML files pre-rendered.`)

  await Promise.all(
    htmlFiles.map(async ({ url, renderResult }) => {
      await writeHtml(url, renderResult, root)
    })
  )
}

async function writeHtml(url: string, html: string, root: string) {
  assert(url.startsWith('/'))
  const pathname =
    (url === '/' ? 'index' : url.slice(1).split('/').join(sep)) + '.html'
  assert(!pathname.startsWith('/') && !pathname.startsWith(sep))
  const htmlFilePath = join(root, 'dist', 'client', pathname)
  await mkdirp(dirname(htmlFilePath))
  await writeFile(htmlFilePath, html)
  console.log(`${gray(join('dist', 'client') + sep)}${blue(pathname)}`)
}

function writeFile(path: string, fileContent: string): Promise<void> {
  return new Promise((resolve, reject) => {
    writeFile_cb(path, fileContent, 'utf8', (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
function mkdirp(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    mkdir(path, { recursive: true }, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
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

  function normalize(
    prerenderElement: unknown
  ): { url: string; contextProps: null | Record<string, unknown> } {
    if (typeof prerenderElement === 'string')
      return { url: prerenderElement, contextProps: null }

    const errMsg1 = `The \`prerender()\` hook defined in \`${prerenderSourceFile}\` returned an invalid value`
    const errMsg2 =
      'Make sure your `prerender()` hook returns an object `{url, contextProps}` or an array of such objects.'
    assertUsage(
      typeof prerenderElement === 'object' &&
        prerenderElement !== null &&
        prerenderElement.constructor === Object,
      `${errMsg1}. ${errMsg2}`
    )
    assertUsage(
      hasProp(prerenderElement, 'url'),
      `${errMsg1}: \`url\` is missing. ${errMsg2}`
    )
    assertUsage(
      typeof prerenderElement.url === 'string',
      `${errMsg1}: unexpected \`url\` of type \`${typeof prerenderElement.url}\`.`
    )
    assertUsage(
      prerenderElement.url.startsWith('/'),
      `${errMsg1}: the \`url\` with value \`${prerenderElement.url}\` doesn't start with \`/\`. Make sure each URL starts with \`/\`.`
    )
    Object.keys(prerenderElement).forEach((key) => {
      assertUsage(
        key === 'url' || key === 'contextProps',
        `${errMsg1}: unexpected object key \`${key}\` ${errMsg2}`
      )
    })
    if (!hasProp(prerenderElement, 'contextProps')) {
      prerenderElement = { ...prerenderElement, contextProps: null }
    }
    assertUsage(
      hasProp(prerenderElement, 'contextProps') &&
        typeof prerenderElement.contextProps === 'object' &&
        (prerenderElement.contextProps === null ||
          prerenderElement.contextProps.constructor === Object),
      `The \`prerender()\` hook exported by ${prerenderSourceFile} returned invalid \`contextProps\`. Make sure all \`contextProps\` to be plain JavaScript object.`
    )
    return prerenderElement as any
  }
}

function assertRenderResult(
  renderResult: unknown
): asserts renderResult is string {
  assertUsage(
    typeof renderResult === 'string',
    "Pre-rendering requires your `html()` render hook to return a string. Open a GitHub issue if that's a problem for you."
  )
}
