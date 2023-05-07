// https://vite-plugin-ssr.com/onRenderClient
export default onRenderClient

import { hydrate, render } from 'solid-js/web'
import { PageLayout } from './PageLayout'
import type { PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient } from 'vite-plugin-ssr/types'
import type { PageContext } from './types'
import { createStore, reconcile } from 'solid-js/store'

type PageContextClient = PageContextBuiltInClient & PageContext

let dispose: () => void
let rendered = false

const [pageContextStore, setPageContext] = createStore<PageContextClient>({} as PageContextClient)

async function onRenderClient(pageContext: PageContextClient) {
  pageContext = removeUnmergableInternals(pageContext)

  if (rendered === false) {
    // Dispose to prevent duplicate pages when navigating.
    if (dispose) dispose()

    setPageContext(pageContext)

    const container = document.querySelector('#page-view')!
    dispose = pageContext.isHydration
      ? hydrate(() => <PageLayout pageContext={pageContextStore} />, container)
      : render(() => <PageLayout pageContext={pageContextStore} />, container)
    rendered = true
  } else {
    setPageContext(reconcile(pageContext))
  }
}

// Avoid reconcile() to throw:
// ```
// dev.js:135 Uncaught (in promise) TypeError: Cannot assign to read only property 'Page' of object '[object Module]'
//   at setProperty (dev.js:135:70)
//   at applyState (dev.js:320:5)
// ```
// TODO/v1-release: remove workaround since _pageFilesAll and _pageFilesLoaded aren't used by the V1 design
function removeUnmergableInternals<T>(pageContext: T): T {
  // Remove pageContext properties that cannot be reassigned by reconcile()
  const pageContextFixed = { ...pageContext }
  // @ts-ignore
  delete pageContextFixed._pageFilesAll
  // @ts-ignore
  delete pageContextFixed._pageFilesLoaded
  return pageContextFixed
}
