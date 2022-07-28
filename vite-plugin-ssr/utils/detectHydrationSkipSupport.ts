export { detectHydrationSkipSupport }

import { assertWarning } from './assert'

function detectHydrationSkipSupport(): boolean {
  const isReact = isReactApp()
  if (isReact) {
    return true
  }
  return false
}

// https://stackoverflow.com/questions/73156433/detect-with-javascript-whether-the-website-is-using-react
function isReactApp() {
  const win = window as any
  // I don't remember where I got this trick from. I guess `__REACT_DEVTOOLS_GLOBAL_HOOK__` is set by React, but I don't know why it's `undefined` at https://reactjs.org/ which doesn't seem to make sense.
  const isReact1 = !!win.__REACT_DEVTOOLS_GLOBAL_HOOK__
  // Set by `@vitejs/plugin-react`
  const isReact2 = !!win.__vite_plugin_react_preamble_installed__
  // Set by `@vitejs/plugin-react` as well
  const isReact3 = !!win.$RefreshReg$
  if (!isReact1 && !isReact2 && !isReact3) {
    return false
  }
  assertWarning(
    isReact1 && isReact2 && isReact3,
    'An internal heuristic needs to be updated, please reach out to a vite-plugin-ssr maintainer.',
    { onlyOnce: true, showStackTrace: true },
  )
  return true
}
