import { getPageFile } from '../page-files/getPageFiles.shared'
import { addUrlToContextProps } from '../utils'
import { assert, assertUsage, assertWarning } from '../utils/assert'
import { getContextPropsProxy } from './getContextPropsProxy'
import { getUrl, getUrlPathname } from './getUrl.client'

export { getPage }
export { getPageById }
export { getPageInfo }

const urlPathnameOriginal = getUrlPathname()
const urlFullOriginal = getUrl()

async function getPage(): Promise<{
  Page: any
  contextProps: Record<string, any>
}> {
  let { pageId, contextProps } = getPageInfo()
  assert(contextProps.urlFull && contextProps.urlPathname)
  const Page = await getPageById(pageId)
  contextProps = getContextPropsProxy(contextProps)
  assertPristineUrl()
  return {
    Page,
    contextProps,
    // @ts-ignore
    get pageProps() {
      assertUsage(
        false,
        "`pageProps` in `const { pageProps } = await getPage()` has been replaced with `const { contextProps } = await getPage()`. The `setPageProps()` hook is deprecated: instead, return `pageProps` in your `addContextProps()` hook and use `passToClient = ['pageProps']` to pass `context.pageProps` to the browser. See `BREAKING CHANGE` in `CHANGELOG.md`."
      )
    }
  }
}

function assertPristineUrl() {
  const urlPathnameCurrent = getUrlPathname()
  assertWarning(
    urlPathnameOriginal === urlPathnameCurrent,
    `\`getPage()\` returned page information for URL \`${urlPathnameOriginal}\` instead of \`${urlPathnameCurrent}\`. If you want to be able to change the URL (e.g. with \`window.history.pushState\`) while using \`getPage()\`, then create a new GitHub issue.`
  )
}

async function getPageById(pageId: string): Promise<any> {
  assert(typeof pageId === 'string')
  const pageFile = await getPageFile('.page', pageId)
  assert(pageFile)
  const { filePath, loadFile } = pageFile
  const fileExports = await loadFile()
  assertUsage(
    typeof fileExports === 'object' && ('Page' in fileExports || 'default' in fileExports),
    `${filePath} should have a \`export { Page }\` (or a default export).`
  )
  const Page = fileExports.Page || fileExports.default
  return Page
}

function getPageInfo(): {
  pageId: string
  contextProps: Record<string, unknown>
} {
  const pageId = window.__vite_plugin_ssr.pageId
  const contextProps = {}
  Object.assign(contextProps, window.__vite_plugin_ssr.contextProps)
  addUrlToContextProps(contextProps, urlFullOriginal)
  return { pageId, contextProps }
}

declare global {
  interface Window {
    __vite_plugin_ssr: {
      pageId: string
      contextProps: Record<string, unknown>
    }
  }
}
