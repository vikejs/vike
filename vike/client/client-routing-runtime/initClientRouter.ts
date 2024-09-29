export { initClientRouter }

import { assert } from './utils.js'
import { initHistoryState, monkeyPatchHistoryPushState } from './history.js'
import { getRenderCount, renderPageClientSide } from './renderPageClientSide.js'
import { onBrowserHistoryNavigation } from './onBrowserHistoryNavigation.js'
import { initOnLinkClick } from './initOnLinkClick.js'
import { setupNativeScrollRestoration } from './scrollRestoration.js'
import { autoSaveScrollPosition } from './setScrollPosition.js'

async function initClientRouter() {
  // Init navigation history and scroll restoration
  initHistoryAndScroll()

  // Render/hydrate
  const renderFirstPagePromise = renderFirstPage()

  // Intercept <a> clicks
  initOnLinkClick()

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
  initHistoryState()
  autoSaveScrollPosition()
  monkeyPatchHistoryPushState()
  // Handle back-/forward navigation
  onBrowserHistoryNavigation()
}
