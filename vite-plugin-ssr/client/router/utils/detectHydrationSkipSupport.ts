export { detectHydrationSkipSupport }

import { assertWarning } from '../utils'

function detectHydrationSkipSupport(): boolean {
  const isReact = isReactApp() ? 1 : 0
  const isVue = isVueApp() ? 1 : 0
  assertWarning(isReact + isVue <= 1, 'Could not reliably detect UI framework. Reach out on Discord or Github.')
  if (isReact) {
    return true
  }
  if (isVue) {
    return false
  }
  return false
}

// https://stackoverflow.com/questions/56817526/how-to-tell-if-a-web-application-is-using-reactjs
function isReactApp() {
  return !!(window as any).React
}
function isVueApp() {
  const detection1 = typeof (window as any).__VUE__ !== 'undefined'
  const detection2 = !!(window as any).Vue
  assertWarning(
    detection1 === detection2,
    'Could not reliably test presence of Vue framework. React out on Discord or Github.',
  )
  return detection1 || detection2
}
