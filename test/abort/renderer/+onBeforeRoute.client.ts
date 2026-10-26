export default onBeforeRoute

import type { PageContextClient } from 'vike/types'
import { abort } from 'vike/abort'

// See /pages/abort-navigation/+Page.tsx
function onBeforeRoute(pageContext: PageContextClient) {
  if (pageContext.isPrefetch) return
  if ((window as any).hasUnsavedChanges && !window.confirm('Leave this page?')) throw abort()
}
