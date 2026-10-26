export { onPageTransitionStart }

import type { PageContextClient } from 'vike/types'

// See ./e2e-test.ts
function onPageTransitionStart(pageContext: Partial<PageContextClient>) {
  const w = window as any
  w.transitions ??= []
  w.transitions.push(`start ${pageContext.urlOriginal}`)
}
