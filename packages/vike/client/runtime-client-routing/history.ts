export { pushHistoryState }
export { replaceHistoryStateOriginal }
export { onPopStateBegin }
export { saveScrollPosition }
export { initHistory }
export { monkeyPatchHistoryAPI }
export type { HistoryInfo }
export type { ScrollPosition }

import { getCurrentUrl } from '../shared/getCurrentUrl.js'
import { assert, assertUsage, getGlobalObject, isObject } from './utils.js'

initHistory() // we redundantly call initHistory() to ensure it's called early
const globalObject = getGlobalObject('runtime-client-routing/history.ts', { previous: getHistoryInfo() })

type StateEnhanced = {
  timestamp: number
  scrollPosition: null | ScrollPosition
  triggeredBy: 'user' | 'vike' | 'browser'
  _isVikeEnhanced: true
}
type ScrollPosition = { x: number; y: number }
type StateNotEnhanced =
  // Default value: `null` (https://developer.mozilla.org/en-US/docs/Web/API/History/state#value)
  | null
  // Maybe there is a browser that sets the default value to `undefined` instead of `null`
  | undefined
  // State may be incomplete if `window.history.state` is set by an old Vike version. (E.g. `state.timestamp` was introduced for `pageContext.isBackwardNavigation` in `0.4.19`.)
  | Partial<StateEnhanced>

// `window.history.state === null` when:
// - The very first render
// - Click on `<a href="#some-hash" />`
// - `location.hash = 'some-hash'`
function enhanceHistoryState() {
  const stateNotEnhanced = getStateNotEnhanced()
  if (isVikeEnhanced(stateNotEnhanced)) return
  const stateVikeEnhanced = enhance(stateNotEnhanced)
  replaceHistoryState(stateVikeEnhanced)
}
function enhance(stateNotEnhanced: StateNotEnhanced): StateEnhanced {
  const timestamp = getTimestamp()
  const scrollPosition = getScrollPosition()
  const triggeredBy = 'browser'
  let stateVikeEnhanced: StateEnhanced
  if (!stateNotEnhanced) {
    stateVikeEnhanced = {
      timestamp,
      scrollPosition,
      triggeredBy,
      _isVikeEnhanced: true,
    }
  } else {
    // State information may be incomplete if `window.history.state` is set by an old Vike version. (E.g. `state.timestamp` was introduced for `pageContext.isBackwardNavigation` in `0.4.19`.)
    stateVikeEnhanced = {
      timestamp: stateNotEnhanced.timestamp ?? timestamp,
      scrollPosition: stateNotEnhanced.scrollPosition ?? scrollPosition,
      triggeredBy: stateNotEnhanced.triggeredBy ?? triggeredBy,
      _isVikeEnhanced: true,
    }
  }
  assert(isVikeEnhanced(stateVikeEnhanced))
  return stateVikeEnhanced
}

function getState(): StateEnhanced {
  const state = getStateNotEnhanced()
  // *Every* state added to the history needs to go through Vike.
  // - Otherwise Vike's `popstate` listener won't work. (Because, for example, if globalObject.previous is outdated => isHashNavigation faulty => client-side navigation is wrongfully skipped.)
  // - Therefore, we have to monkey patch history.pushState() and history.replaceState()
  // - Therefore, we need the assert() below to ensure history.state has been enhanced by Vike
  //   - If users stumble upon this assert() then let's make it a assertUsage()
  assert(isVikeEnhanced(state), { state })
  return state
}
function getStateNotEnhanced(): StateNotEnhanced {
  const state: StateNotEnhanced = window.history.state
  return state
}

function getScrollPosition(): ScrollPosition {
  const scrollPosition = { x: window.scrollX, y: window.scrollY }
  return scrollPosition
}
function getTimestamp() {
  return new Date().getTime()
}

function saveScrollPosition() {
  const scrollPosition = getScrollPosition()
  const state = getState()
  replaceHistoryState({ ...state, scrollPosition })
}

function pushHistoryState(url: string, overwriteLastHistoryEntry: boolean) {
  if (!overwriteLastHistoryEntry) {
    const state: StateEnhanced = {
      timestamp: getTimestamp(),
      // I don't remember why I set it to `null`, maybe because setting it now would be too early? (Maybe there is a delay between renderPageClientSide() is finished and the browser updating the scroll position.) Anyways, it seems like autoSaveScrollPosition() is enough.
      scrollPosition: null,
      triggeredBy: 'vike',
      _isVikeEnhanced: true,
    }
    // Calling the monkey patched history.pushState() (and not the original) so that other tools (e.g. user tracking) can listen to Vike's pushState() calls.
    // - https://github.com/vikejs/vike/issues/1582
    window.history.pushState(state, '', url)
  } else {
    replaceHistoryState(getState(), url)
  }
}
function replaceHistoryState(state: StateEnhanced, url?: string) {
  const url_ = url ?? null // Passing `undefined` chokes older Edge versions.
  window.history.replaceState(state, '', url_)
  assert(isVikeEnhanced(getState()))
}
function replaceHistoryStateOriginal(state: unknown, url: string) {
  // Bypass all monkey patches.
  // - Useful, for example, to avoid other tools listening to history.replaceState() calls
  History.prototype.replaceState.bind(window.history)(state, '', url)
}

// Monkey patch:
// - history.pushState()
// - history.replaceState()
function monkeyPatchHistoryAPI() {
  ;(['pushState', 'replaceState'] as const).forEach((funcName) => {
    const funcOriginal = window.history[funcName].bind(window.history)
    window.history[funcName] = (stateOriginal: unknown = {}, ...rest) => {
      assertUsage(
        stateOriginal === undefined || stateOriginal === null || isObject(stateOriginal),
        `history.${funcName}(state) argument state must be an object`,
      )
      const stateEnhanced: StateEnhanced = isVikeEnhanced(stateOriginal)
        ? stateOriginal
        : {
            _isVikeEnhanced: true,
            scrollPosition: getScrollPosition(),
            timestamp: getTimestamp(),
            triggeredBy: 'user',
            ...stateOriginal,
          }
      assert(isVikeEnhanced(stateEnhanced))
      funcOriginal(stateEnhanced, ...rest)
      assert(isVikeEnhanced(getState()))
      globalObject.previous = getHistoryInfo()
    }
  })
}

function isVikeEnhanced(state: unknown): state is StateEnhanced {
  if (isObject(state) && '_isVikeEnhanced' in state) {
    /* We don't use the assert() below to save client-side KBs.
    assert(hasProp(state, '_isVikeEnhanced', 'true'))
    assert(hasProp(state, 'timestamp', 'number'))
    assert(hasProp(state, 'scrollPosition'))
    if (state.scrollPosition !== null) {
      assert(hasProp(state, 'scrollPosition', 'object'))
      assert(hasProp(state.scrollPosition, 'x', 'number') && hasProp(state.scrollPosition, 'y', 'number'))
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

  const isHistoryStateEnhanced = window.history.state !== null
  if (!isHistoryStateEnhanced) enhanceHistoryState()
  assert(isVikeEnhanced(window.history.state))

  const current = getHistoryInfo()
  globalObject.previous = current

  return { isHistoryStateEnhanced, previous, current }
}

function initHistory() {
  enhanceHistoryState() // enhance very first window.history.state which is `null`
}
