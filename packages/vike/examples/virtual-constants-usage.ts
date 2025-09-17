// Example of how to use the virtual module for Vike constants
// This provides a more reliable way to access constants in production with ssr.external

import { __VIKE__IS_DEV, __VIKE__IS_CLIENT, __VIKE__IS_DEBUG } from 'virtual:vike:constants'

// Example usage in a utility function
export function isDevMode(): boolean {
  return __VIKE__IS_DEV
}

export function isClientSide(): boolean {
  return __VIKE__IS_CLIENT
}

export function isDebugEnabled(): boolean {
  // Only use on client-side or check client-side first
  if (__VIKE__IS_CLIENT && __VIKE__IS_DEBUG) {
    return true
  }
  return false
}

// Example: Conditional code execution
if (__VIKE__IS_DEV) {
  console.log('Development mode enabled')
}

if (__VIKE__IS_CLIENT) {
  console.log('Running on client-side')
} else {
  console.log('Running on server-side')
}

// Example: Tree-shaking friendly debug code
if (__VIKE__IS_CLIENT && __VIKE__IS_DEBUG) {
  console.log('Debug mode enabled on client')
}

// Example: Conditional imports (tree-shaking)
let devOnlyModule: any
if (__VIKE__IS_DEV) {
  devOnlyModule = await import('./dev-only-module.js')
}

// Example: Environment-specific configuration
const config = {
  apiUrl: __VIKE__IS_DEV ? 'http://localhost:3000' : 'https://api.example.com',
  enableLogging: __VIKE__IS_DEV || (__VIKE__IS_CLIENT && __VIKE__IS_DEBUG),
  cacheEnabled: !__VIKE__IS_DEV,
}

export { config }
