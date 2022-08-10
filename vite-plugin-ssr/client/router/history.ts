export { initHistoryState, getHistoryState, pushHistory, ScrollPosition, saveScrollPosition }

import { assertUsage, hasProp, isPlainObject } from './utils'

// No way found to add TypeScript types to `history.state`: https://github.com/microsoft/TypeScript/issues/36178
type HistoryState = {
  timestamp: number
  scrollPosition: null | ScrollPosition
}
type ScrollPosition = { x: number; y: number }

// Ensure `window.history.state` to always be `HistoryState`
function initHistoryState() {
  const state = getInitState()
  assertState(state)
  replaceHistoryState(state)
}

function getInitState(): HistoryState {
  let timestamp = getTimestamp()
  let scrollPosition = getScrollPosition()
  let state: Partial<HistoryState> = window.history.state
  // The very first `window.history.state` is `undefined` (before we invoked `initHistoryState()`)
  if (!state) {
    state = {}
  }
  // `window.history.state` set by an old vite-plugin-ssr version may miss `timestamp`
  if (!('timestamp' in state)) {
    state.timestamp = timestamp
  }
  // `window.history.state` set by an old vite-plugin-ssr version may miss `scrollPosition`
  if (!('scrollPosition' in state)) {
    state.scrollPosition = scrollPosition
  }
  assertState(state)
  return state
}

function getHistoryState(): HistoryState {
  const state: unknown = window.history.state
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
    pushHistoryState({ timestamp, scrollPosition: null }, url)
  } else {
    replaceHistoryState(getHistoryState(), url)
  }
}

function assertState(state: unknown): asserts state is HistoryState {
  const msg =
    'Manipulating `window.history.state` is forbidden (only vite-plugin-ssr is allowed to). Does one of your library try to manipulate it?'
  assertUsage(isPlainObject(state), msg)
  assertUsage('timestamp' in state, msg)
  assertUsage('scrollPosition' in state, msg)
  assertUsage(Object.keys(state).length === 2, msg)

  const { timestamp } = state
  assertUsage(typeof timestamp === 'number', msg)

  const { scrollPosition } = state
  if (scrollPosition !== null) {
    assertUsage(hasProp(scrollPosition, 'x', 'number') && hasProp(scrollPosition, 'y', 'number'), msg)
    assertUsage(Object.keys(scrollPosition).length === 2, msg)
  }
}
function replaceHistoryState(state: HistoryState, url?: string) {
  window.history.replaceState(state, '', url)
}
function pushHistoryState(state: HistoryState, url: string) {
  window.history.pushState(state, '', url)
}
