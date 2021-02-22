import { getUserFile } from './user-files/getUserFiles.shared'
import { assert, assertUsage } from './utils/assert'

export { getPage }

async function getPage(): Promise<{
  Page: any
  pageProps: Record<string, any>
}> {
  const pageId = getPageId()
  assert(pageId)

  const Page = await getPage_(pageId)

  const pageProps = getPageProps()
  assert(pageProps)

  return { Page, pageProps }
}

async function getPage_(pageId: string): Promise<any> {
  const pageFile = await getUserFile('.page', pageId)
  assert(pageFile)
  const { filePath, loadFile } = pageFile
  const fileExports = await loadFile()
  assertUsage(
    typeof fileExports === 'object' &&
      ('Page' in fileExports || 'default' in fileExports),
    `${filePath} should have a \`export { Page }\`.`
  )
  const Page = fileExports.Page || fileExports.default
  return Page
}

function getPageId(): string {
  //@ts-ignore
  return window.__vite_plugin_ssr.pageId
}

function getPageProps(): Record<string, any> {
  //@ts-ignore
  return window.__vite_plugin_ssr.pageProps
}
