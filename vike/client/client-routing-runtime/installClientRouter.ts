export { installClientRouter }

import { assert } from './utils.js'
import { initHistoryState, monkeyPatchHistoryPushState } from './history.js'
import { getRenderCount, renderPageClientSide } from './renderPageClientSide.js'
import { onBrowserHistoryNavigation } from './onBrowserHistoryNavigation.js'
import { onLinkClick } from './onLinkClick.js'
import { setupNativeScrollRestoration } from './scrollRestoration.js'
import { autoSaveScrollPosition } from './setScrollPosition.js'

function installClientRouter() {
  setupNativeScrollRestoration()
  initHistoryState()
  autoSaveScrollPosition()
  monkeyPatchHistoryPushState()

  // First initial render
  assert(getRenderCount() === 0)
  renderPageClientSide({ scrollTarget: 'preserve-scroll', isBackwardNavigation: null, isClientSideNavigation: false })
  assert(getRenderCount() === 1)

  // Intercept <a> links
  onLinkClick()
  // Handle back-/forward navigation
  onBrowserHistoryNavigation()
}
