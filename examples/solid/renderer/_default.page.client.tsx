export const clientRouting = true
export { render }

import { hydrate, render as render_ } from 'solid-js/web'
import { PageLayout } from './PageLayout'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client/router'
import type { PageContext } from './types'

let dispose: () => void

async function render(pageContext: PageContextBuiltInClient & PageContext) {
  const content = document.getElementById('page-view')
  const { Page, pageProps } = pageContext

  // Dispose to prevent duplicate pages when navigating.
  if (dispose) dispose()

  // Render the page
  if (pageContext.isHydration) {
    // This is the first page rendering; the page has been rendered to HTML
    // and we now make it interactive.
    dispose = hydrate(
      () => (
        <PageLayout>
          <Page {...pageProps} />
        </PageLayout>
      ),
      content!,
    )
  } else {
    // Render new page
    render_(
      () => (
        <PageLayout>
          <Page {...pageProps} />
        </PageLayout>
      ),
      content!,
    )
  }
}
