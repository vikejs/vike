// There doesn't seem to be a reliable way to detect React:
//  - https://stackoverflow.com/questions/73156433/detect-with-javascript-whether-the-website-is-using-react
export function isReact() {
  // Heuristic using values set by React (Dev Tools)
  // - `window.__REACT_DEVTOOLS_GLOBAL_HOOK__` is an internal API for React Dev Tools
  //   - https://stackoverflow.com/questions/46807826/how-does-react-developer-tools-determine-that-the-webpage-is-using-react/46808361#46808361
  //   - In principle, `window.__REACT_DEVTOOLS_GLOBAL_HOOK__` should exist only if React Dev Tools is installed. (Although it seems that it's sometimes defined even when React Dev Tools isn't installed; I don't know why.)
  // - We use `isReact1`/`isReact2` merely to validate `isReact3` and `isReact4`. Because `isReact1`/`isReact2` can be false negatives:
  //   - React populates `__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers` fairly late => false negative early in the rendering phase
  //   - `window.__REACT_DEVTOOLS_GLOBAL_HOOK__` is `undefined` if React Dev Tools isn't installed => false negative
  const isReact1 = !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers?.size
  const isReact2 = !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__?.rendererInterfaces?.size

  // Heuristic using values set by `@vitejs/plugin-react`
  const isReact3 = !!(window as any).__vite_plugin_react_preamble_installed__
  /* Also set by Preact Vite plugin `@preact/preset-vite`
  const isReact4 = !!(window as any).$RefreshReg$
  */

  // console.log({ isReact1, isReact2, isReact3 })
  return isReact1 || isReact2 || isReact3
}
