export { injectRollupInputs }
export { normalizeRollupInput }

import type { Rollup } from 'vite'
import { assert } from './assert.js'
import { isObject } from './isObject.js'
import { isArray } from './isArray.js'
type InputOption = Rollup.InputOption
type InputsMap = Record<string, string>

function injectRollupInputs(inputsNew: InputsMap, inputCurrent: InputOption | undefined): InputsMap {
  const inputsCurrent = normalizeRollupInput(inputCurrent)
  const input = {
    ...inputsNew,
    ...inputsCurrent,
  }
  return input
}

function normalizeRollupInput(input?: InputOption): InputsMap {
  if (!input) {
    return {}
  }
  // Usually `input` is an object, but the user can set it as a `string` or `string[]`
  if (typeof input === 'string') {
    input = [input]
  }
  if (isArray(input)) {
    return Object.fromEntries(input.map((input) => [input, input]))
  }
  assert(isObject(input))
  return input
}
