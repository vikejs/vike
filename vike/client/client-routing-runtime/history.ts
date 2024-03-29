export {
  initHistoryState,
  getHistoryState,
  pushHistory,
  ScrollPosition,
  saveScrollPosition,
  monkeyPatchHistoryPushState
}

import { assert, assertUsage, hasProp, isObject } from './utils.js'

type HistoryState = {
  timestamp?: number
  scrollPosition?: null | ScrollPosition
  triggeredBy?: 'user' | 'vike' | 'browser'
  _isVikeEnhanced: true
}
type ScrollPosition = { x: number; y: number }

// Fill missing state information:
//  - `history.state` can uninitialized (i.e. `null`):
//    - The very first render
//    - The user's code runs `location.hash = '#section'`
//    - The user clicks on an anchor link `<a href="#section">Section</a>` (Vike's `onLinkClick()` handler skips hash links).
//  - State information may be incomplete if `history.state` is set by an old Vike version. (E.g. `state.timestamp` was introduced for `pageContext.isBackwardNavigation` in `0.4.19`.)
function initHistoryState() {
  // No way found to add TypeScript types to `window.history.state`: https://github.com/microsoft/TypeScript/issues/36178
  let state: HistoryState = window.history.state
  if (!state) {
    state = { _isVikeEnhanced: true }
  }
  let hasModifications = false
  if (!('timestamp' in state)) {
    hasModifications = true
    state.timestamp = getTimestamp()
  }
  if (!('scrollPosition' in state)) {
    hasModifications = true
    state.scrollPosition = getScrollPosition()
  }
  if (!('triggeredBy' in state)) {
    state.triggeredBy = 'browser'
  }
  assertState(state)
  if (hasModifications) {
    replaceHistoryState(state)
  }
}

function getHistoryState(): HistoryState {
  const state: unknown = window.history.state || {}
  assertState(state)
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
  const state = getHistoryState()
  replaceHistoryState({ ...state, scrollPosition })
}

function pushHistory(url: string, overwriteLastHistoryEntry: boolean) {
  if (!overwriteLastHistoryEntry) {
    const timestamp = getTimestamp()
    pushHistoryState({ timestamp, scrollPosition: null, triggeredBy: 'vike', _isVikeEnhanced: true }, url)
  } else {
    replaceHistoryState(getHistoryState(), url)
  }
}

function assertState(state: unknown): asserts state is HistoryState {
  assert(isObject(state))

  if ('timestamp' in state) {
    const { timestamp } = state
    assert(typeof timestamp === 'number')
  }

  if ('scrollPosition' in state) {
    const { scrollPosition } = state
    if (scrollPosition !== null) {
      assert(hasProp(scrollPosition, 'x', 'number') && hasProp(scrollPosition, 'y', 'number'))
    }
  }
}
function replaceHistoryState(state: HistoryState, url?: string) {
  const url_ = url ?? null // Passing `undefined` chokes older Edge versions.
  window.history.replaceState(state, '', url_)
}
function pushHistoryState(state: HistoryState, url: string) {
  // Vike should call window.history.pushState() (and not the orignal `pushStateOriginal()`) so that other tools (e.g. user tracking) can listen to Vike's pushState() calls, see https://github.com/vikejs/vike/issues/1582.
  window.history.pushState(state, '', url)
}

function monkeyPatchHistoryPushState() {
  const pushStateOriginal = window.history.pushState
  window.history.pushState = (stateOriginal: unknown = {}, ...rest) => {
    assertUsage(
      stateOriginal === undefined || stateOriginal === null || isObject(stateOriginal),
      'history.pushState(state) argument state must be an object'
    )
    const stateEnhanced: HistoryState = isVikeEnhanced(stateOriginal)
      ? stateOriginal
      : {
          _isVikeEnhanced: true,
          scrollPosition: getScrollPosition(),
          timestamp: getTimestamp(),
          triggeredBy: 'user',
          ...stateOriginal
        }
    return pushStateOriginal!(stateEnhanced, ...rest)
  }
}

function isVikeEnhanced(state: unknown): state is HistoryState {
  return isObject(state) && '_isVikeEnhanced' in state
}
