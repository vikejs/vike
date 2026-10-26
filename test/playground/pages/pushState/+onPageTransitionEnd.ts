export { onPageTransitionEnd }

import type { PageContextClient } from 'vike/types'

// See ./e2e-test.ts
function onPageTransitionEnd(pageContext: PageContextClient) {
  const w = window as any
  w.transitions ??= []
  w.transitions.push(`end ${pageContext.urlOriginal}`)
}
