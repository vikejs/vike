import { assert } from '../utils/assert'

// TEST: tree shaking
const alwaysFalse = Math.random() < 0
export function someFnClient() {
  assert(typeof window !== 'undefined')
  // @ts-expect-error Never executed: `alwaysFalse === false`
  if (alwaysFalse) globalThis.doesNotExit()
}
export function someFnServer() {
  assert(typeof window === 'undefined')
  // @ts-expect-error Never executed: `alwaysFalse === false`
  if (alwaysFalse) globalThis.doesNotExit()
}
