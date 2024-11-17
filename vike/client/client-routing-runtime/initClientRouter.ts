export { initClientRouter }

import { assert } from './utils'
import { getRenderCount, renderPageClientSide } from './renderPageClientSide'
import { initOnPopState } from './initOnPopState'
import { initOnLinkClick } from './initOnLinkClick'
import { setupNativeScrollRestoration } from './scrollRestoration'
import { autoSaveScrollPosition } from './setScrollPosition'
import { initLinkPrefetchHandlers } from './prefetch'

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
  await renderPageClientSide({
    scrollTarget: { preserveScroll: true },
    isBackwardNavigation: null,
    isClientSideNavigation: false
  })
}

function initHistoryAndScroll() {
  setupNativeScrollRestoration()
  autoSaveScrollPosition()
  // Handle back-/forward navigation
  initOnPopState()
}
