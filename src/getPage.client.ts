import { loadUserFile } from './user-files/findUserFiles.shared'
import { assert } from './utils/assert'

export { getPage }

type PageView = any
type InitialProps = Record<string, any>

async function getPage(): Promise<{
  pageView: PageView
  initialProps: InitialProps
}> {
  const pageId = getPageId()
  assert(pageId)

  const pageView = await loadUserFile('.page', { pageId })

  const initialProps = getInitialProps()
  assert(initialProps)

  return { pageView, initialProps }
}

function getPageId(): string {
  //@ts-ignore
  return window.__vite_plugin_ssr.pageId
}

function getInitialProps(): Record<string, any> {
  //@ts-ignore
  return window.__vite_plugin_ssr.initialProps
}
