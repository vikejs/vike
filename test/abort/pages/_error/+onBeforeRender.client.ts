export { onBeforeRender }

import type { PageContextClient } from '../../renderer/types'

// test.ts holds the error page of `?slow-error-page` until it calls releaseErrorPage()
async function onBeforeRender(pageContext: PageContextClient) {
  if (!('slow-error-page' in pageContext.urlParsed.search)) return
  await new Promise((resolve) => {
    ;(window as any).releaseErrorPage = resolve
  })
}
