import { loadUserFile } from '../node/findUserFiles'
import { route } from '../node/route.shared'
import { assert } from '../node/utils/assert'

export { hydratePage }

async function hydratePage() {
  const url = window.location.pathname

  const pageId = await route(url)
  assert(pageId)

  const pageView = await loadUserFile('.page', { pageId })
  const initialProps = { testProp: 42 }

  const browserInit = await loadUserFile('.browser', { defaultFile: true })
  await browserInit({ pageView, initialProps })
}
