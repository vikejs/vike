export { getHistoryState, enhanceHistoryState, pushHistoryState, type ScrollPosition, saveScrollPosition }

import { assert, assertUsage, hasProp, isObject } from './utils.js'

let initStateEnhanced: true | undefined
init()

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
      _isVikeEnhanced: true
    }
  } else {
    // State information may be incomplete if `window.history.state` is set by an old Vike version. (E.g. `state.timestamp` was introduced for `pageContext.isBackwardNavigation` in `0.4.19`.)
    stateVikeEnhanced = {
      timestamp: stateNotEnhanced.timestamp ?? timestamp,
      scrollPosition: stateNotEnhanced.scrollPosition ?? scrollPosition,
      triggeredBy: stateNotEnhanced.triggeredBy ?? triggeredBy,
      _isVikeEnhanced: true
    }
  }
  assert(isVikeEnhanced(stateVikeEnhanced))
  return stateVikeEnhanced
}

function getStateEnhanced(): StateEnhanced {
  const state = getStateNotEnhanced()
  // This assert() will most likely eventually cause issues. Let's then:
  // - Replace the assert() call with enhanceHistoryState()
  // - Remove the race condition buster `initStateEnhanced` as it won't be needed anymore
  assert(isVikeEnhanced(state))
  return state
}
function getStateNotEnhanced(): StateNotEnhanced {
  const state: StateNotEnhanced = window.history.state
  return state
}

function getHistoryState(): StateEnhanced {
  if (!initStateEnhanced) enhanceHistoryState() // avoid race condition
  return getStateEnhanced()
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
  const state = getStateEnhanced()
  replaceHistoryState({ ...state, scrollPosition })
}

function pushHistoryState(url: string, overwriteLastHistoryEntry: boolean) {
  if (!overwriteLastHistoryEntry) {
    const timestamp = getTimestamp()
    pushState(
      {
        timestamp,
        // I don't remember why I set it to `null`, maybe because setting it now would be too early? (Maybe there is a delay between renderPageClientSide() is finished and the browser updating the scroll position.) Anyways, it seems like autoSaveScrollPosition() is enough.
        scrollPosition: null,
        triggeredBy: 'vike',
        _isVikeEnhanced: true
      },
      url
    )
  } else {
    replaceHistoryState(getStateEnhanced(), url)
  }
}

function replaceHistoryState(state: StateEnhanced, url?: string) {
  const url_ = url ?? null // Passing `undefined` chokes older Edge versions.
  window.history.replaceState(state, '', url_)
}
function pushState(state: StateEnhanced, url: string) {
  // Vike should call window.history.pushState() (and not the orignal `pushStateOriginal()`) so that other tools (e.g. user tracking) can listen to Vike's pushState() calls, see https://github.com/vikejs/vike/issues/1582.
  window.history.pushState(state, '', url)
}

function monkeyPatchHistoryPushState() {
  const pushStateOriginal = window.history.pushState.bind(window.history)
  window.history.pushState = (stateOriginal: unknown = {}, ...rest) => {
    assertUsage(
      stateOriginal === undefined || stateOriginal === null || isObject(stateOriginal),
      'history.pushState(state) argument state must be an object'
    )
    const stateEnhanced: StateEnhanced = isVikeEnhanced(stateOriginal)
      ? stateOriginal
      : {
          _isVikeEnhanced: true,
          scrollPosition: getScrollPosition(),
          timestamp: getTimestamp(),
          triggeredBy: 'user',
          ...stateOriginal
        }
    assert(isVikeEnhanced(stateEnhanced))
    return pushStateOriginal!(stateEnhanced, ...rest)
  }
}

function isVikeEnhanced(state: unknown): state is StateEnhanced {
  const yes = isObject(state) && '_isVikeEnhanced' in state
  if (yes) assertStateVikeEnhanced(state)
  return yes
}
function assertStateVikeEnhanced(state: unknown): asserts state is StateEnhanced {
  assert(isObject(state))
  assert(hasProp(state, '_isVikeEnhanced', 'true'))
  // TODO/eventually: remove assert() below to save client-side KBs
  assert(hasProp(state, 'timestamp', 'number'))
  assert(hasProp(state, 'scrollPosition'))
  if (state.scrollPosition !== null) {
    assert(hasProp(state, 'scrollPosition', 'object'))
    assert(hasProp(state.scrollPosition, 'x', 'number') && hasProp(state.scrollPosition, 'y', 'number'))
  }
}

function init() {
  enhanceHistoryState()
  initStateEnhanced = true
  monkeyPatchHistoryPushState()
}
