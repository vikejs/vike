export { detectHydrationSkipSupport }

import { assert, assertWarning } from './assert'

function detectHydrationSkipSupport(): boolean {
  const isReact = isReactApp()
  if (isReact) {
    return true
  }
  return false
}

// There doesn't seem to be a reliable way to detect React:
//  - https://stackoverflow.com/questions/73156433/detect-with-javascript-whether-the-website-is-using-react
function isReactApp() {
  // Heursitic using values set by React (Dev Tools)
  // - `window.__REACT_DEVTOOLS_GLOBAL_HOOK__` is an internal API for React Dev Tools
  //   - https://stackoverflow.com/questions/46807826/how-does-react-developer-tools-determine-that-the-webpage-is-using-react/46808361#46808361
  //   - In principle, `window.__REACT_DEVTOOLS_GLOBAL_HOOK__` should exist only if React Dev Tools is installed. (Although it seems that it's sometimes defined even when React Dev Tools isn't installed; I don't know why.)
  // - We use `isReact1`/`isReact2` merely to validate `isReact3` and `isReact4`. Beacuse `isReact1`/`isReact2` can be false negatives:
  //   - React populates `__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers` fairly late => false negative early in the rendering phase
  //   - `window.__REACT_DEVTOOLS_GLOBAL_HOOK__` is `undefined` if React Dev Tools isn't installed => false negative
  const isReact1 = !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers?.size
  const isReact2 = !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__?.rendererInterfaces?.size

  // Heursitic using values set by `@vitejs/plugin-react`
  const isReact3 = !!(window as any).__vite_plugin_react_preamble_installed__
  const isReact4 = !!(window as any).$RefreshReg$

  const assertHeuristic = (condition: boolean) => {
    assertWarning(
      condition,
      'An internal heuristic needs to be updated, see https://github.com/brillout/vite-plugin-ssr/issues/423',
      { onlyOnce: true }
    )
  }

  if (isReact1 || isReact2) {
    assertHeuristic(isReact1 && isReact2 && isReact3 && isReact4)
    return true
  }

  if (isReact3 || isReact4) {
    // See explanation above of why `isReact1` and `isReact2` are `false`
    assert(isReact1 === false && isReact2 === false)
    assertHeuristic(isReact3 && isReact4)
    return true
  }

  return false
}
