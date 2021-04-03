import { getUserFile } from '../user-files/getUserFiles.shared'
import { assert, assertUsage, assertWarning } from '../utils/assert'
import { navigationState } from './navigationState.client'

export { getPage }
export { getPageById }
export { getPageInfo }

async function getPage(): Promise<{
  Page: any
  pageProps: Record<string, any>
}> {
  const { pageId, pageProps } = getPageInfo()
  const Page = await getPageById(pageId)
  assertPristineUrl()
  return { Page, pageProps }
}

function assertPristineUrl() {
  assertWarning(
    navigationState.isFirstNavigation,
    `\`getPage()\` returned page information for URL \`${navigationState.urlOriginal}\` instead of \`${navigationState.urlNow}\`. If you want to be able to change the URL (e.g. with \`window.history.pushState\`) while using \`getPage()\`, then create a new GitHub issue.`
  )
}

async function getPageById(pageId: string): Promise<any> {
  assert(typeof pageId === 'string')
  const pageFile = await getUserFile('.page', pageId)
  assert(pageFile)
  const { filePath, loadFile } = pageFile
  const fileExports = await loadFile()
  assertUsage(
    typeof fileExports === 'object' &&
      ('Page' in fileExports || 'default' in fileExports),
    `${filePath} should have a \`export { Page }\` (or a default export).`
  )
  const Page = fileExports.Page || fileExports.default
  return Page
}

function getPageInfo(): {
  pageId: string
  pageProps: Record<string, unknown>
} {
  const pageId = window.__vite_plugin_ssr.pageId
  const pageProps = window.__vite_plugin_ssr.pageProps
  return { pageId, pageProps }
}

declare global {
  interface Window {
    __vite_plugin_ssr: {
      pageId: string
      pageProps: Record<string, unknown>
    }
  }
}
