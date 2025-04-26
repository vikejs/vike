import { assert } from '../utils/assert'

const alwaysFalse = Math.random() < 0
export function someFnClient() {
  assert(typeof window !== 'undefined')
  if (alwaysFalse) console.log('someFnClient()')
}
export function someFnServer() {
  assert(typeof window === 'undefined')
  if (alwaysFalse) console.log('someFnClient()')
}
