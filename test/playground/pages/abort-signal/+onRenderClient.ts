export { onRenderClient }

import type { PageContextClient } from 'vike/types'

// TEST: pageContext.abortSignal
// Like an onRenderClient() hook that waits for the UI framework to show the page: it finishes once the user navigates to another page.
async function onRenderClient(pageContext: PageContextClient) {
  await new Promise((resolve) => pageContext.abortSignal!.addEventListener('abort', resolve))
}
