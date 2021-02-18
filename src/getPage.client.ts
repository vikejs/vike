import { loadUserFile } from './user-files/findUserFiles.shared'
import { assert } from './utils/assert'

export { getPage }

type InitialProps = Record<string, any>

async function getPage(): Promise<{
  Page: any
  initialProps: InitialProps
}> {
  const pageId = getPageId()
  assert(pageId)

  const Page = await loadUserFile('.page', { pageId })

  const initialProps = getInitialProps()
  assert(initialProps)

  return { Page, initialProps }
}

function getPageId(): string {
  //@ts-ignore
  return window.__vite_plugin_ssr.pageId
}

function getInitialProps(): Record<string, any> {
  //@ts-ignore
  return window.__vite_plugin_ssr.initialProps
}
