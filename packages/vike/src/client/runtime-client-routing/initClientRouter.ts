import '../assertEnvClient.js'

export { initClientRouter }

import { assert } from '../../utils/assert.js'
import { getRenderCount, renderPageClient } from './renderPageClient.js'
import { initOnPopState } from './initOnPopState.js'
import { initOnLinkClick } from './initOnLinkClick.js'
import { scrollRestoration_init } from './scrollRestoration.js'
import { autoSaveScrollPosition } from './setScrollPosition.js'
import { initLinkPrefetchHandlers } from './prefetch.js'
import { initHistory } from './history.js'

async function initClientRouter() {
  // Init navigation history and scroll restoration
  initHistoryAndScroll()

  // Render/hydrate
  const renderFirstPagePromise = renderFirstPage()

  // Intercept <a> clicks
  initOnLinkClick()

  // Add <a> prefetch handlers
  initLinkPrefetchHandlers()

  // Preserve stack track
  await renderFirstPagePromise
}

async function renderFirstPage() {
  assert(getRenderCount() === 0)
  await renderPageClient({
    scrollTarget: { preserveScroll: true },
    isClientSideNavigation: false,
  })
}

function initHistoryAndScroll() {
  scrollRestoration_init()
  initHistory() // we redundantly call initHistory() to ensure it's called early
  autoSaveScrollPosition()
  // Handle back-/forward navigation
  initOnPopState()
}
