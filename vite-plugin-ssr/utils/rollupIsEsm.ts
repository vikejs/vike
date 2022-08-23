import { assert } from './assert'
export function rollupIsEsm(rollupOptions: { format: string }) {
  const { format } = rollupOptions
  assert(typeof format === 'string')
  assert(
    format === 'amd' ||
      format === 'cjs' ||
      format === 'es' ||
      format === 'iife' ||
      format === 'system' ||
      format === 'umd'
  )
  return format === 'es'
}
