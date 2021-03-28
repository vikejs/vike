import { getUserFile } from '../user-files/getUserFiles.shared'
import { assert, assertUsage } from '../utils/assert'
import { getPageInfo } from './getPageInfo.client'

export { getPage }

async function getPage(): Promise<{
  Page: any
  pageProps: Record<string, any>
}> {
  const { pageIdPromise, pagePropsPromise } = getPageInfo()

  const [Page, pageProps] = await Promise.all([
    (async () => await getPage_(await pageIdPromise))(),
    (async () => await pagePropsPromise)()
  ])
  assert(pageProps.constructor === Object)

  return { Page, pageProps }
}

async function getPage_(pageId: string): Promise<any> {
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
