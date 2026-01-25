import '../assertEnvClient.js'

export { initClientRouter }

import { assert } from '../../utils/assert.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { getRenderCount, renderPageClient } from './renderPageClient.js'
import { initOnPopState } from './initOnPopState.js'
import { initOnLinkClick } from './initOnLinkClick.js'
import { scrollRestoration_init } from './scrollRestoration.js'
import { autoSaveScrollPosition } from './setScrollPosition.js'
import { initLinkPrefetchHandlers } from './prefetch.js'
import { initHistory } from './history.js'
import { setVirtualFileExportsGlobalEntry } from '../shared/getGlobalContextClientInternalShared.js'
// @ts-expect-error
import * as virtualFileExportsGlobalEntry from 'virtual:vike:global-entry:client:client-routing'

const globalObject = getGlobalObject<{
  done?: true
}>('initClientRouter.ts', {})

function initClientRouter() {
  setVirtualFileExportsGlobalEntry(virtualFileExportsGlobalEntry)

  if (globalObject.done) return
  globalObject.done = true

  // Init navigation history and scroll restoration
  initHistoryAndScroll()

  // Render/hydrate
  renderFirstPage()

  // Intercept <a> clicks
  initOnLinkClick()

  // Add <a> prefetch handlers
  initLinkPrefetchHandlers()
}

function renderFirstPage() {
  assert(getRenderCount() === 0)
  renderPageClient({
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
