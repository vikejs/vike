import { assert, assertUsage } from '../../utils'

export { navigate }

assert(isNodejs())

function navigate(): never {
  assertUsage(
    false,
    '[`navigate(url)`] The `navigate(url)` function is only callable in the browser but you are calling it in Node.js.'
  )
}

function isNodejs() {
  return typeof window === 'undefined'
}
