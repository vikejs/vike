import { getPageFile } from '../page-files/getPageFiles.shared'
import { getUrlPathname, hasProp } from '../utils'
import { assert, assertUsage, assertWarning } from '../utils/assert'
import { getPageContextProxy } from './getPageContextProxy'

export { getPage }
export { getPageById }
export { getPageInfo }

const urlPathnameOriginal = getUrlPathname()

async function getPage(): Promise<{ Page: any } & Record<string, any>> {
  let { pageId, pageContext } = getPageInfo()
  const Page = await getPageById(pageId)
  pageContext.Page = Page
  pageContext = getPageContextProxy(pageContext)
  assertPristineUrl()
  assert(hasProp(pageContext, 'Page'))
  return pageContext
}

function assertPristineUrl() {
  const urlPathnameCurrent = getUrlPathname()
  assertWarning(
    urlPathnameOriginal === urlPathnameCurrent,
    `\`getPage()\` returned page information for URL \`${urlPathnameOriginal}\` instead of \`${urlPathnameCurrent}\`. If you want to be able to change the URL (e.g. with \`window.history.pushState\`) while using \`getPage()\`, then create a new GitHub issue.`
  )
}

async function getPageById(pageId: string): Promise<any> {
  const pageFile = await getPageFile('.page', pageId)
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
  pageContext: Record<string, unknown>
} {
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
