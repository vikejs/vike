export { deepEqual }

import { assertIsNotBrowser } from './assertIsNotBrowser.js'
assertIsNotBrowser() // Keep client-side KBs minimal: this cycle-safe version is server-only, see https://github.com/vikejs/vike/pull/3548

// https://stackoverflow.com/questions/201183/how-to-determine-equality-for-two-javascript-objects/32922084#32922084
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
