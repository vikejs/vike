export { detectHydrationSkipSupport }

function detectHydrationSkipSupport(): boolean {
  const isReact = isReactApp()
  if (isReact) {
    return true
  }
  return false
}

function isReactApp() {
  return !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__
}
