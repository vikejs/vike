export { pushHistoryState }
export { replaceHistoryStateOriginal }
export { onPopStateBegin }
export { saveScrollPosition }
export { initHistory }
export type { HistoryInfo }
export type { ScrollPosition }

import { getCurrentUrl } from '../shared/getCurrentUrl.js'
import { assert, assertUsage, getGlobalObject, isObject, deepEqual, redirectHard } from './utils.js'

const globalObject = getGlobalObject('history.ts', {
  monkeyPatched: false,
  previous: undefined as any as HistoryInfo,
})
initHistory() // we redundantly call initHistory() to ensure it's called early
globalObject.previous = getHistoryInfo()

type VikeHistoryData = {
  timestamp: number
  scrollPosition: null | ScrollPosition
  triggeredBy: 'user' | 'vike' | 'browser'
}
type StateEnhanced = {
  _isVikeEnhanced: VikeHistoryData
  [key: string]: unknown
}
type ScrollPosition = { x: number; y: number }

// `window.history.state === null` when:
// - The very first render
// - Click on `<a href="#some-hash" />`
// - `location.hash = 'some-hash'`
function enhanceHistoryState() {
  if (isVikeEnhanced(window.history.state as unknown)) return
  const stateVikeEnhanced = enhance(window.history.state as unknown)
  replaceHistoryState(stateVikeEnhanced)
}
function enhance(stateNotEnhanced: unknown): StateEnhanced {
  const timestamp = getTimestamp()
  const scrollPosition = getScrollPosition()
  const triggeredBy = 'browser'
  let stateVikeEnhanced: StateEnhanced
  if (!stateNotEnhanced) {
    stateVikeEnhanced = {
      _isVikeEnhanced: {
        timestamp,
        scrollPosition,
        triggeredBy,
      },
    }
  } else {
    // State information may be incomplete if `window.history.state` is set by an old Vike version. (E.g. `state.timestamp` was introduced for `pageContext.isBackwardNavigation` in `0.4.19`.)
    let oldVikeData: Partial<VikeHistoryData>
    if (isObject(stateNotEnhanced) && '_isVikeEnhanced' in stateNotEnhanced) {
      if (isObject(stateNotEnhanced._isVikeEnhanced)) {
        // New format: _isVikeEnhanced is an object with nested properties
        oldVikeData = stateNotEnhanced._isVikeEnhanced as Partial<VikeHistoryData>
      } else {
        // Old format: _isVikeEnhanced is true, properties are on state root
        oldVikeData = stateNotEnhanced as Partial<VikeHistoryData>
      }
    } else {
      oldVikeData = {}
    }
    stateVikeEnhanced = {
      ...stateNotEnhanced,
      _isVikeEnhanced: {
        timestamp: oldVikeData.timestamp ?? timestamp,
        scrollPosition: oldVikeData.scrollPosition ?? scrollPosition,
        triggeredBy: oldVikeData.triggeredBy ?? triggeredBy,
      },
    }
  }
  assertIsVikeEnhanced(stateVikeEnhanced)
  return stateVikeEnhanced
}

function getState(): StateEnhanced {
  const state = window.history.state as unknown
  // *Every* state added to the history needs to go through Vike.
  // - Otherwise Vike's `popstate` listener won't work. (Because, for example, if globalObject.previous is outdated => isHashNavigation faulty => client-side navigation is wrongfully skipped.)
  // - Therefore, we have to monkey patch history.pushState() and history.replaceState()
  // - Therefore, we need the assert() below to ensure history.state has been enhanced by Vike
  //   - If users stumble upon this assert() then let's make it a assertUsage()
  assertIsVikeEnhanced(state)
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

  // Don't overwrite history.state if it was set by a non-Vike history.pushState() call.
  // https://github.com/vikejs/vike/issues/2801#issuecomment-3490431479
  if (!isVikeEnhanced(window.history.state)) return

  const state = getState()
  replaceHistoryState({ ...state, _isVikeEnhanced: { ...state._isVikeEnhanced, scrollPosition } })
}

function pushHistoryState(url: string, overwriteLastHistoryEntry: boolean) {
  if (!overwriteLastHistoryEntry) {
    const state: StateEnhanced = {
      _isVikeEnhanced: {
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
}
function replaceHistoryState(state: StateEnhanced, url?: string) {
  const url_ = url ?? null // Passing `undefined` chokes older Edge versions.
  window.history.replaceState(state, '', url_)
  assertIsVikeEnhanced(window.history.state as unknown)
}
function replaceHistoryStateOriginal(state: unknown, url: Parameters<typeof window.history.replaceState>[2]) {
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
    window.history[funcName] = (stateOriginal: unknown = {}, ...rest) => {
      assertUsage(
        stateOriginal === undefined || stateOriginal === null || isObject(stateOriginal),
        `history.${funcName}(state) argument state must be an object`,
      )

      const stateEnhanced: StateEnhanced = isVikeEnhanced(stateOriginal)
        ? stateOriginal
        : {
            ...stateOriginal,
            _isVikeEnhanced: {
              scrollPosition: getScrollPosition(),
              timestamp: getTimestamp(),
              triggeredBy: 'user',
              ...(stateOriginal?._isVikeEnhanced as undefined | Record<string, unknown>),
            },
          }
      assertIsVikeEnhanced(stateEnhanced)
      funcOriginal(stateEnhanced, ...rest)
      assert(isEqual(stateEnhanced, window.history.state as unknown))

      globalObject.previous = getHistoryInfo()

      // Workaround https://github.com/vikejs/vike/issues/2504#issuecomment-3149764736
      queueMicrotask(() => {
        if (isEqual(stateEnhanced, window.history.state as unknown)) return
        Object.assign(stateEnhanced, window.history.state as unknown)
        assertIsVikeEnhanced(stateEnhanced)
        replaceHistoryStateOriginal(stateEnhanced, rest[1])
        assert(isEqual(stateEnhanced, window.history.state as unknown))
      })
    }
  })
}

function isEqual(state1: unknown, state2: unknown) {
  return deepEqual((state1 as any)?._isVikeEnhanced, (state2 as any)?._isVikeEnhanced)
}

function isVikeEnhanced(state: unknown): state is StateEnhanced {
  if ((state as any)?._isVikeEnhanced) {
    /* We don't use the assert() below to save client-side KBs.
    const vikeData = state._isVikeEnhanced
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
function assertIsVikeEnhanced(state: unknown): asserts state is StateEnhanced {
  if (isVikeEnhanced(state)) return
  assert(false, { state })
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

  const isHistoryStateEnhanced = isVikeEnhanced(window.history.state)
  // Either:
  // - `window.history.pushState(null, '', '/some-path')` , or
  // - hash navigation
  //   - Click on `<a href="#some-hash">`
  //   - Using the `location` API (only hash navigation)
  // See comments a the top of the ./initOnPopState.ts file.
  const isHistoryStatePristine = window.history.state === null

  if (!isHistoryStateEnhanced && !isHistoryStatePristine) {
    // Going to a history entry not created by Vike — entering another "SPA realm" => hard reload
    // https://github.com/vikejs/vike/issues/2801#issuecomment-3490431479
    redirectHard(getCurrentUrl())
    return { skip: true as const }
  }
  if (!isHistoryStateEnhanced) enhanceHistoryState()
  assertIsVikeEnhanced(window.history.state as unknown)

  const current = getHistoryInfo()
  globalObject.previous = current

  // Let the browser handle hash navigations.
  // - Upon hash navigation: `isHistoryStatePristine===true` (see comment above).
  if (isHistoryStatePristine) {
    return { skip: true as const }
  }

  return { previous, current }
}

function initHistory() {
  monkeyPatchHistoryAPI() // the earlier we call it the better (Vike can workaround erroneous library monkey patches if Vike is the last one in the monkey patch chain)
  enhanceHistoryState() // enhance very first window.history.state which is `null`
}
