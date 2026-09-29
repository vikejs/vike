export { deepEqual }

import { assertIsNotBrowser } from './assertIsNotBrowser.js'
// If client-side needs it then use a more minimal version to save client-side KBs:
// https://github.com/vikejs/vike/blob/165d572a5994ccd0e56e43fe2993b1cef117ee7f/packages/vike/src/utils/deepEqual.ts
assertIsNotBrowser()

function deepEqual(x: any, y: any): boolean {
  return deepEqualCyclic(x, y, new Map())
}

// Supports cyclic objects, e.g. Vite plugins
function deepEqualCyclic(x: any, y: any, seen: Map<object, Set<object>>): boolean {
  if (x === y) return true
  if (!x || !y || typeof x !== 'object' || typeof y !== 'object') return false
  // A pair seen before is either being compared higher up (a cycle) or already found equal
  const seenY = seen.get(x) ?? new Set<object>()
  if (seenY.has(y)) return true
  seen.set(x, seenY.add(y))
  const keys = Object.keys(x)
  return keys.length === Object.keys(y).length && keys.every((key) => deepEqualCyclic(x[key], y[key], seen))
}
