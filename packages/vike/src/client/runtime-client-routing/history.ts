export { pushHistoryState }
export { replaceHistoryStateOriginal }
export { onPopStateBegin }
export { saveScrollPosition }
export { initHistory }
export type { HistoryInfo }
export type { ScrollPosition }

import { getCurrentUrl } from '../shared/getCurrentUrl.js'
import { assertUsage, assertWarning } from '../../utils/assert.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { isObject } from '../../utils/isObject.js'
import { redirectHard } from '../../utils/redirectHard.js'
import '../assertEnvClient.js'

const globalObject = getGlobalObject('history.ts', {
  monkeyPatched: false,
  previous: undefined as any as HistoryInfo,
})
initHistory() // we redundantly call initHistory() to ensure it's called early
globalObject.previous = getHistoryInfo()

type StateEnhanced = {
  vike: {
    timestamp: number
    scrollPosition: null | ScrollPosition
    triggeredBy: 'user' | 'vike' | 'browser'
  }
}
type ScrollPosition = { x: number; y: number }

// `window.history.state === null` when:
// - The very first render
// - Click on `<a href="#some-hash" />`
// - `location.hash = 'some-hash'`
function enhance() {
  if (isEnhanced(window.history.state as unknown)) return
  const stateEnhanced = {
    vike: {
      timestamp: getTimestamp(),
      scrollPosition: getScrollPosition(),
      triggeredBy: 'browser' as const,
    },
  }
  replaceHistoryState(stateEnhanced)
}

function getState(): StateEnhanced {
  const state = window.history.state as unknown
  // *Every* state added to the history needs to go through Vike.
  // - Otherwise Vike's `popstate` listener won't work. (Because, for example, if globalObject.previous is outdated => isHashNavigation faulty => client-side navigation is wrongfully skipped.)
  // - Therefore, we have to monkey patch history.pushState() and history.replaceState()
  // - Therefore, history.state is usually enhanced — if it isn't (another tool overwrote it, or the browser ignores
  //   the History API) then we treat it as unknown: timestamp 0 => isBackwardNavigation === null
  if (isEnhanced(state)) return state
  return { vike: { timestamp: 0, scrollPosition: null, triggeredBy: 'browser' } }
}

function getScrollPosition(): ScrollPosition {
  const scrollPosition = { x: window.scrollX, y: window.scrollY }
  return scrollPosition
}
function getTimestamp() {
  return new Date().getTime()
}

function saveScrollPosition(scrollPosition?: ScrollPosition) {
  scrollPosition ||= getScrollPosition()

  // Don't overwrite history.state if it was set by a non-Vike history.pushState() call.
  // https://github.com/vikejs/vike/issues/2801#issuecomment-3490431479
  if (!isEnhanced(window.history.state)) return

  const state = getState()
  replaceHistoryState({ ...state, vike: { ...state.vike, scrollPosition } })
}

function pushHistoryState(url: string, overwriteLastHistoryEntry: boolean) {
  if (!overwriteLastHistoryEntry) {
    const state: StateEnhanced = {
      vike: {
        timestamp: getTimestamp(),
        // I don't remember why I set it to `null`, maybe because setting it now would be too early? (Maybe there is a delay between renderPageClient() is finished and the browser updating the scroll position.) Anyways, it seems like autoSaveScrollPosition() is enough.
        scrollPosition: null,
        triggeredBy: 'vike',
      },
    }
    // Calling the monkey patched history.pushState() (and not the original) so that other tools (e.g. user tracking) can listen to Vike's pushState() calls.
    // - https://github.com/vikejs/vike/issues/1582
    window.history.pushState(state, '', url)
  } else {
    replaceHistoryState(getState(), url)
  }
  if (getCurrentUrl() === url) return
  // The browser ignored the History API (WebKit does this inside a lazily loaded cross-origin iframe, which it gives
  // no session history entry) => Client Routing is impossible => fall back to Server Routing. The hard navigation
  // creates a history entry, restoring the History API. https://github.com/vikejs/vike/issues/3509
  assertWarning(false, 'The browser ignores the History API => falling back to Server Routing.', { onlyOnce: true })
  redirectHard(url)
}
function replaceHistoryState(state: StateEnhanced, url?: string) {
  const url_ = url ?? null // Passing `undefined` chokes older Edge versions.
  window.history.replaceState(state, '', url_)
}
function replaceHistoryStateOriginal(state: unknown, url?: Parameters<typeof window.history.replaceState>[2]) {
  // Bypass all monkey patches.
  // - Useful, for example, to avoid other tools listening to history.replaceState() calls
  History.prototype.replaceState.bind(window.history)(state, '', url)
}

// Monkey patch:
// - history.pushState()
// - history.replaceState()
function monkeyPatchHistoryAPI() {
  if (globalObject.monkeyPatched) return
  globalObject.monkeyPatched = true
  /* This assertion can fail: https://github.com/vikejs/vike/issues/2504#issuecomment-3149764736
  // Ensure Vike's monkey patch is the first.
  assert(window.history.pushState === History.prototype.pushState)
  */
  ;(['pushState', 'replaceState'] as const).forEach((funcName) => {
    const funcOriginal = window.history[funcName].bind(window.history)
    window.history[funcName] = (stateFromUser: unknown = {}, ...rest) => {
      assertUsage(
        stateFromUser === undefined || stateFromUser === null || isObject(stateFromUser),
        `history.${funcName}(state) argument state must be an object`,
      )

      const state: StateEnhanced = isEnhanced(stateFromUser)
        ? stateFromUser
        : {
            ...stateFromUser,
            vike: {
              scrollPosition: getScrollPosition(),
              timestamp: getTimestamp(),
              triggeredBy: 'user',
            },
          }
      funcOriginal(state, ...rest)

      globalObject.previous = getHistoryInfo()

      // Workaround https://github.com/vikejs/vike/issues/2504#issuecomment-3149764736
      queueMicrotask(() => {
        if (isEnhanced(window.history.state)) return
        Object.assign(state, window.history.state as unknown)
        replaceHistoryStateOriginal(
          state,
          /* Don't overwrite the URL changed by other tools https://github.com/vikejs/vike/issues/2894#issuecomment-3662644369
         rest[1],
          */
        )
      })
    }
  })
}

function isEnhanced(state: unknown): state is StateEnhanced {
  if ((state as any)?.vike) {
    /* We don't use the assert() below to save client-side KBs.
    const vikeData = state.vike
    assert(isObject(vikeData))
    assert(hasProp(vikeData, 'timestamp', 'number'))
    assert(hasProp(vikeData, 'scrollPosition'))
    if (vikeData.scrollPosition !== null) {
      assert(hasProp(vikeData, 'scrollPosition', 'object'))
      assert(hasProp(vikeData.scrollPosition, 'x', 'number') && hasProp(vikeData.scrollPosition, 'y', 'number'))
    }
    //*/
    return true
  }
  return false
}

type HistoryInfo = {
  url: `/${string}`
  state: StateEnhanced
}
function getHistoryInfo(): HistoryInfo {
  return {
    url: getCurrentUrl(),
    state: getState(),
  }
}
function onPopStateBegin() {
  const { previous } = globalObject

  const isStateEnhanced = isEnhanced(window.history.state)
  // Either:
  // - `window.history.pushState(null, '', '/some-path')` , or
  // - hash navigation
  //   - Click on `<a href="#some-hash">`
  //   - Using the `location` API (only hash navigation)
  // See comments a the top of the ./initOnPopState.ts file.
  const isStatePristine = window.history.state === null

  if (!isStateEnhanced && !isStatePristine) {
    // Going to a history entry not created by Vike — entering another "SPA realm" => hard reload
    // https://github.com/vikejs/vike/issues/2801#issuecomment-3490431479
    redirectHard(getCurrentUrl())
    return { skip: true as const }
  }
  if (!isStateEnhanced) enhance()

  const current = getHistoryInfo()
  globalObject.previous = current

  // Let the browser handle hash navigations.
  // - Upon hash navigation: `isHistoryStatePristine===true` (see comment above).
  if (isStatePristine) {
    return { skip: true as const }
  }

  return { previous, current }
}

function initHistory() {
  monkeyPatchHistoryAPI() // the earlier we call it the better (Vike can workaround erroneous library monkey patches if Vike is the last one in the monkey patch chain)
  enhance() // enhance very first window.history.state which is `null`
}
