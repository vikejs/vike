import { loadUserFile } from './user-files/findUserFiles.shared'
import { route } from './route.shared'
import { assert } from './utils/assert'

export { getPage }

type PageView = any
type InitialProps = Record<string, any>

async function getPage(): Promise<{
  pageView: PageView
  initialProps: InitialProps
}> {
  const url = window.location.pathname

  const pageId = await route(url)
  assert(pageId)

  const pageView = await loadUserFile('.page', { pageId })
  const initialProps = { testProp: 42 }

  return { pageView, initialProps }
}
