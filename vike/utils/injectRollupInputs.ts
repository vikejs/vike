export { injectRollupInputs }
export { normalizeRollupInput }

import type { ResolvedConfig, Rollup } from 'vite'
import { assert } from './assert.js'
import { isObject } from './isObject.js'
type InputOption = Rollup.InputOption
type InputsMap = Record<string, string>

function injectRollupInputs(inputsNew: InputsMap, config: ResolvedConfig): InputsMap {
  const inputsCurrent = normalizeRollupInput(config.build.rollupOptions.input)
  const input = {
    ...inputsNew,
    ...inputsCurrent
  }
  return input
}

function normalizeRollupInput(input?: InputOption): InputsMap {
  if (!input) {
    return {}
  }
  // Usually `input` is an oject, but the user can set it as a `string` or `string[]`
  if (typeof input === 'string') {
    input = [input]
  }
  if (Array.isArray(input)) {
    return Object.fromEntries(input.map((input) => [input, input]))
  }
  assert(isObject(input))
  return input
}
