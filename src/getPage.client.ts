import { getUserFile } from './user-files/findUserFiles.shared'
import { assert, assertUsage } from './utils/assert'

export { getPage }

type InitialProps = Record<string, any>

async function getPage(): Promise<{
  Page: any
  initialProps: InitialProps
}> {
  const pageId = getPageId()
  assert(pageId)

  const Page = await getPageView(pageId)

  const initialProps = getInitialProps()
  assert(initialProps)

  return { Page, initialProps }
}

async function getPageView(pageId: string) {
  const pageFile = await getUserFile('.page', pageId)
  assert(pageFile)
  const { filePath, loadFile } = pageFile
  const fileExports = await loadFile()
  assertUsage(
    typeof fileExports === 'object' && 'default' in fileExports,
    `${filePath} should have a default export.`
  )
  const Page = fileExports.default
  return Page
}

function getPageId(): string {
  //@ts-ignore
  return window.__vite_plugin_ssr.pageId
}

function getInitialProps(): Record<string, any> {
  //@ts-ignore
  return window.__vite_plugin_ssr.initialProps
}
