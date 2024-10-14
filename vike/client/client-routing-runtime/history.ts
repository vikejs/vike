export {
  initHistoryState,
  getHistoryState,
  pushHistory,
  type ScrollPosition,
  saveScrollPosition,
  monkeyPatchHistoryPushState
}

import { assert, assertUsage, getGlobalObject, hasProp, isObject } from './utils.js'

const globalObject = getGlobalObject('history.ts', { currenState: getState_enhance() })

type StateVikeEnhanced = {
  timestamp: number
  scrollPosition: null | ScrollPosition
  triggeredBy: 'user' | 'vike' | 'browser'
  _isVikeEnhanced: true
}
type ScrollPosition = { x: number; y: number }

type StateNotInitialized =
  // Uninitialized => `null` (https://developer.mozilla.org/en-US/docs/Web/API/History/state#value)
  | null
  // Maybe there is a browser that sets the uninitialized value to be `undefined` instead of `null`
  | undefined
  // State may be incomplete if `window.history.state` is set by an old Vike version. (E.g. `state.timestamp` was introduced for `pageContext.isBackwardNavigation` in `0.4.19`.)
  | Partial<StateVikeEnhanced>
  // Already enhanced
  | StateVikeEnhanced

// `window.history.state` can be uninitialized (i.e. `null`):
// - The very first render
// - The user's code runs `location.hash = '#section'`
// - The user clicks on an anchor link `<a href="#section">Section</a>` (Vike's `initOnLinkClick()` handler skips hash links).
function initHistoryState() {
  const stateNotInitialized: StateNotInitialized = window.history.state

  const stateVikeEnhanced = enhanceState(stateNotInitialized)

  replaceHistoryState(stateVikeEnhanced)
}

function enhanceState(stateNotInitialized: StateNotInitialized): StateVikeEnhanced {
  // Already enhanced
  if (isVikeEnhanced(stateNotInitialized)) {
    return stateNotInitialized
  }

  const timestamp = getTimestamp()
  const scrollPosition = getScrollPosition()
  const triggeredBy = 'browser'

  let stateVikeEnhanced: StateVikeEnhanced
  if (!stateNotInitialized) {
    stateVikeEnhanced = {
      timestamp,
      scrollPosition,
      triggeredBy,
      _isVikeEnhanced: true
    }
  } else {
    // State information may be incomplete if `window.history.state` is set by an old Vike version. (E.g. `state.timestamp` was introduced for `pageContext.isBackwardNavigation` in `0.4.19`.)
    stateVikeEnhanced = {
      timestamp: stateNotInitialized.timestamp ?? timestamp,
      scrollPosition: stateNotInitialized.scrollPosition ?? scrollPosition,
      triggeredBy: stateNotInitialized.triggeredBy ?? triggeredBy,
      _isVikeEnhanced: true
    }
  }

  assert(isVikeEnhanced(stateVikeEnhanced))
  return stateVikeEnhanced
}

function getState_alreadyEnhanced(): StateVikeEnhanced {
  const { currenState } = globalObject
  assert(isVikeEnhanced(currenState))
  return currenState
}

function getState_enhance(): StateVikeEnhanced {
  const state = getHistoryState()
  if (isVikeEnhanced(state)) {
    return state
  } else {
    return enhanceState(state)
  }
}

function getHistoryState(): StateNotInitialized {
  const state: StateNotInitialized = window.history.state
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
  const state = getState_alreadyEnhanced()
  replaceHistoryState({ ...state, scrollPosition })
}

function pushHistory(url: string, overwriteLastHistoryEntry: boolean) {
  if (!overwriteLastHistoryEntry) {
    const timestamp = getTimestamp()
    pushHistoryState(
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
    replaceHistoryState(getState_alreadyEnhanced(), url)
  }
}

function replaceHistoryState(state: StateVikeEnhanced, url?: string) {
  const url_ = url ?? null // Passing `undefined` chokes older Edge versions.
  window.history.replaceState(state, '', url_)
}
function pushHistoryState(state: StateVikeEnhanced, url: string) {
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
    const stateEnhanced: StateVikeEnhanced = isVikeEnhanced(stateOriginal)
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

function isVikeEnhanced(state: unknown): state is StateVikeEnhanced {
  const yes = isObject(state) && '_isVikeEnhanced' in state
  if (yes) assertStateVikeEnhanced(state)
  return yes
}
function assertStateVikeEnhanced(state: unknown): asserts state is StateVikeEnhanced {
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
