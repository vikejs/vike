export { installClientRouter }

import { assert } from './utils.js'
import { initHistoryState, monkeyPatchHistoryPushState } from './history.js'
import { getRenderCount, renderPageClientSide } from './renderPageClientSide.js'
import { onBrowserHistoryNavigation } from './onBrowserHistoryNavigation.js'
import { onLinkClick } from './onLinkClick.js'
import { setupNativeScrollRestoration } from './scrollRestoration.js'
import { autoSaveScrollPosition } from './setScrollPosition.js'

async function installClientRouter() {
  // Init navigation history and scroll restoration
  initHistoryAndScroll()

  // Render initial page
  const renderPromise = render()

  // Intercept <a> clicks
  onLinkClick()

  // Preserve stack track
  await renderPromise
}

async function render() {
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
