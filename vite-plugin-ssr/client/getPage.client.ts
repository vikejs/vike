import { getPageFile } from '../shared/getPageFiles.shared'
import { getUrlPathname } from '../utils'
import { assert, assertUsage, assertWarning } from '../utils/assert'
import { assert_pageContext_publicProps } from './assert_pageContext_publicProps'
import { getPageContextProxy } from './getPageContextProxy'

export { getPage }
export { getPageById }
export { getPageInfo }

const urlPathnameOriginal = getUrlPathname()

async function getPage(): Promise<{ Page: any } & Record<string, any>> {
  let { pageId, pageContext } = getPageInfo()
  const { Page, pageExports } = await getPageById(pageId)
  pageContext.Page = Page
  pageContext.pageExports = pageExports
  pageContext = getPageContextProxy(pageContext)
  assertPristineUrl()
  assert_pageContext_publicProps(pageContext)
  return pageContext
}

function assertPristineUrl() {
  const urlPathnameCurrent = getUrlPathname()
  assertWarning(
    urlPathnameOriginal === urlPathnameCurrent,
    `\`getPage()\` returned page information for URL \`${urlPathnameOriginal}\` instead of \`${urlPathnameCurrent}\`. If you want to be able to change the URL (e.g. with \`window.history.pushState\`) while using \`getPage()\`, then create a new GitHub issue.`
  )
}

async function getPageById(pageId: string): Promise<{ Page: unknown; pageExports: Record<string, unknown> }> {
  const pageFile = await getPageFile('.page', pageId)
  const { filePath, loadFile } = pageFile
  const fileExports = await loadFile()
  assertUsage(
    typeof fileExports === 'object' && ('Page' in fileExports || 'default' in fileExports),
    `${filePath} should have a \`export { Page }\` or \`export default\`.`
  )
  const pageExports = fileExports
  const Page = pageExports.Page || pageExports.default
  return { Page, pageExports }
}

function getPageInfo(): {
  pageId: string
  pageContext: Record<string, unknown>
} {
  assertUsage(
    '__vite_plugin_ssr__pageContext' in window,
    'Client-side `pageContext` missing. Make sure to apply `html._injectAssets()` to the HTML strings you generate.'
  )

  const pageContext: Record<string, unknown> = {}
  Object.assign(pageContext, window.__vite_plugin_ssr__pageContext)

  assert(typeof pageContext._pageId === 'string')
  const pageId = pageContext._pageId

  return { pageId, pageContext }
}

declare global {
  interface Window {
    __vite_plugin_ssr__pageContext: Record<string, unknown>
  }
}
