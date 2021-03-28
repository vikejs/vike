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
} from './route.shared'
import { assert, assertUsage, assertWarning, hasProp, urlToFile } from './utils'
import { setSsrEnv } from './ssrEnv.node'
import { getPageFunctions, prerenderPage } from './renderPage.node'
import { blue, green, gray, cyan } from 'kolorist'

export { prerender }

type HtmlDocument = {
  url: string
  htmlDocument: string
  pagePropsSerialized: string | null
}

/**
 * Used for proxying regular HTTP(S) requests
 * @param partial Allow only a subset of pages to be pre-rendered.
 * @param clientRouter Serialize `pageProps` to JSON files for Client-side Routing.
 * @param base Public base path.
 */
async function prerender({
  partial = false,
  clientRouter = false,
  base
}: {
  partial?: boolean
  clientRouter?: boolean
  base?: string
} = {}) {
  assertArguments(partial, clientRouter, base)
  const serializePageProps = clientRouter
  const baseUrl = base

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
    viteDevServer: undefined,
    baseUrl
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

  const htmlDocuments: HtmlDocument[] = []
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
        const { htmlDocument, pagePropsSerialized } = await prerenderPage(
          pageId,
          { ...contextProps, ...routeResult.contextPropsAddendum },
          url,
          !noPrenderContextProps,
          serializePageProps
        )
        htmlDocuments.push({ url, htmlDocument, pagePropsSerialized })
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
        const { htmlDocument, pagePropsSerialized } = await prerenderPage(
          pageId,
          contextProps,
          url,
          false,
          serializePageProps
        )
        htmlDocuments.push({ url, htmlDocument, pagePropsSerialized })
      })
  )
  console.log(
    `${green(`✓`)} ${htmlDocuments.length} HTML documents pre-rendered.`
  )

  await Promise.all(
    htmlDocuments.map((htmlDoc) => writeHtmlDocument(htmlDoc, root))
  )
}

async function writeHtmlDocument(
  { url, htmlDocument, pagePropsSerialized }: HtmlDocument,
  root: string
) {
  assert(url.startsWith('/'))
  let fileBase = urlToFile(url)
  assert(fileBase.startsWith('/'))
  fileBase = fileBase.slice(1)
  fileBase = fileBase.split('/').join(sep)
  assert(!fileBase.startsWith('/') && !fileBase.startsWith(sep))
  const pathBase = join(root, 'dist', 'client', fileBase)
  await mkdirp(dirname(pathBase))

  const write = async (
    fileExtension: '.html' | '.pageProps.json',
    content: string
  ) => {
    const fileUrl = fileBase + fileExtension
    const filePath = pathBase + fileExtension
    await writeFile(filePath, content)
    console.log(`${gray(join('dist', 'client') + sep)}${blue(fileUrl)}`)
  }

  const writeJobs = [write('.html', htmlDocument)]
  if (pagePropsSerialized !== null) {
    writeJobs.push(write('.pageProps.json', pagePropsSerialized))
  }
  await Promise.all(writeJobs)
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

function assertArguments(
  partial: unknown,
  clientRouter: unknown,
  base: unknown
) {
  assertUsage(
    partial === true || partial === false,
    '[prerender()] Option `partial` should be a boolean.'
  )
  assertUsage(
    clientRouter === true || clientRouter === false,
    '[prerender()] Option `clientRouter` should be a boolean.'
  )
  assertUsage(
    base === undefined || typeof base === 'string',
    '[prerender()] Option `base` should be a string.'
  )
}
