// Example of how to use Vike constants
// The virtual module is automatically loaded, so globalThis variables are reliable in production with ssr.external
// No imports needed - just use the globalThis variables directly

// Example usage in a utility function
export function isDevMode(): boolean {
  return globalThis.__VIKE__IS_DEV ?? false
}

export function isClientSide(): boolean {
  return globalThis.__VIKE__IS_CLIENT ?? false
}

export function isDebugEnabled(): boolean {
  // Only use on client-side or check client-side first
  if (globalThis.__VIKE__IS_CLIENT && globalThis.__VIKE__IS_DEBUG) {
    return true
  }
  return false
}

// Example: Conditional code execution
if (globalThis.__VIKE__IS_DEV) {
  console.log('Development mode enabled')
}

if (globalThis.__VIKE__IS_CLIENT) {
  console.log('Running on client-side')
} else {
  console.log('Running on server-side')
}

// Example: Tree-shaking friendly debug code
if (globalThis.__VIKE__IS_CLIENT && globalThis.__VIKE__IS_DEBUG) {
  console.log('Debug mode enabled on client')
}

// Example: Conditional imports (tree-shaking)
let devOnlyModule: any
if (globalThis.__VIKE__IS_DEV) {
  devOnlyModule = await import('./dev-only-module.js')
}

// Example: Environment-specific configuration
const config = {
  apiUrl: globalThis.__VIKE__IS_DEV ? 'http://localhost:3000' : 'https://api.example.com',
  enableLogging: globalThis.__VIKE__IS_DEV || (globalThis.__VIKE__IS_CLIENT && globalThis.__VIKE__IS_DEBUG),
  cacheEnabled: !globalThis.__VIKE__IS_DEV,
}

export { config }
