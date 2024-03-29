export {
  initHistoryState,
  getHistoryState,
  pushHistory,
  ScrollPosition,
  saveScrollPosition,
  monkeyPatchHistoryPushState
}

import { assert, assertUsage, getGlobalObject, hasProp, isObject } from './utils.js'
const globalObject = getGlobalObject<{
  pushStateOriginal?: PushStateOriginal
}>('history.ts', {})

// No way found to add TypeScript types to `history.state`: https://github.com/microsoft/TypeScript/issues/36178
type HistoryState = {
  timestamp?: number
  scrollPosition?: null | ScrollPosition
  triggeredBy?: 'user' | 'vike' | 'browser'
}
type ScrollPosition = { x: number; y: number }

function isVikeHistoryState(state: unknown): state is HistoryState {
  return (
    !!state && typeof state === 'object' && 'timestamp' in state && 'scrollPosition' in state && 'triggeredBy' in state
  )
}

// Fill missing state information:
//  - `history.state` can uninitialized (i.e. `null`):
//    - The very first render
//    - The user's code runs `location.hash = '#section'`
//    - The user clicks on an anchor link `<a href="#section">Section</a>` (Vike's `onLinkClick()` handler skips hash links).
//  - State information may be incomplete if `history.state` is set by an old Vike version. (E.g. `state.timestamp` was introduced for `pageContext.isBackwardNavigation` in `0.4.19`.)
function initHistoryState() {
  let state: HistoryState = window.history.state
  if (!state) {
    state = {}
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
    pushHistoryState({ timestamp, scrollPosition: null, triggeredBy: 'vike' }, url)
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
  window.history.replaceState(state, '', url ?? /* Passing `undefined` chokes older Edge versions */ null)
}
function pushHistoryState(state: HistoryState, url: string) {
  window.history.pushState(state, '', url)
}

function monkeyPatchHistoryPushState() {
  globalObject.pushStateOriginal = globalObject.pushStateOriginal ?? window.history.pushState
  window.history.pushState = (stateFromUser: unknown = {}, ...rest) => {
    assertUsage(
      null === stateFromUser || undefined === stateFromUser || isObject(stateFromUser),
      'history.pushState(state) argument state must be an object'
    )
    // biome-ignore format:
    const state: HistoryState = isVikeHistoryState(stateFromUser) ? stateFromUser : {
      scrollPosition: getScrollPosition(),
      timestamp: getTimestamp(),
      ...stateFromUser,
      // Don't allow user to overwrite triggeredBy as it would break Vike's handling of the 'popstate' event
      triggeredBy: 'user'
    }
    return pushStateOriginal!(state, ...rest)
  }
}
type PushStateOriginal = typeof history.pushState
function pushStateOriginal(...args: Parameters<PushStateOriginal>): ReturnType<PushStateOriginal> {
  globalObject.pushStateOriginal!.apply(history, args)
}
