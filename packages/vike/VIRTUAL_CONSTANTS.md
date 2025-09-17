# Vike Virtual Constants Module

This document explains the new virtual module approach for accessing Vike constants in production environments.

## Problem Solved

Previously, Vike used `globalThis` variables (`__VIKE__IS_DEV`, `__VIKE__IS_CLIENT`, `__VIKE__IS_DEBUG`) that were set via Vite's `define` config. However, in production environments with `ssr.external`, these variables would remain `undefined` because Vite isn't loaded, causing reliability issues.

## Solution: Virtual Module

Vike now provides a virtual module `virtual:vike:constants` that exports these constants reliably in all environments.

### Usage

```typescript
import { __VIKE__IS_DEV, __VIKE__IS_CLIENT, __VIKE__IS_DEBUG } from 'virtual:vike:constants'

// Check if in development mode
if (__VIKE__IS_DEV) {
  console.log('Development mode enabled')
}

// Check if running on client-side
if (__VIKE__IS_CLIENT) {
  console.log('Running in browser')
} else {
  console.log('Running on server')
}

// Check debug mode (client-side only)
if (__VIKE__IS_CLIENT && __VIKE__IS_DEBUG) {
  console.log('Debug mode enabled')
}
```

### Available Constants

- `__VIKE__IS_DEV: boolean` - Like `import.meta.env.DEV` but works inside `node_modules/` (even if package is `ssr.external`)
- `__VIKE__IS_CLIENT: boolean` - Like `import.meta.env.SSR` but inverted, works inside `node_modules/` (even if package is `ssr.external`)
- `__VIKE__IS_DEBUG: boolean | undefined` - Whether debug flags are enabled (client-side only, always `undefined` on server-side)

### Benefits

1. **Reliable in Production**: Works correctly with `ssr.external` configurations
2. **TypeScript Support**: Proper type definitions included
3. **Tree-shaking**: Enables better dead code elimination
4. **Explicit Imports**: More maintainable than global variables
5. **Environment Safety**: Clear distinction between client/server availability

### Backward Compatibility

The plugin still sets the `globalThis` variables for backward compatibility:
- `globalThis.__VIKE__IS_DEV`
- `globalThis.__VIKE__IS_CLIENT` 
- `globalThis.__VIKE__IS_DEBUG`

However, it's recommended to migrate to the virtual module approach for better reliability.

### Migration Guide

**Before:**
```typescript
if (globalThis.__VIKE__IS_DEV) {
  // development code
}
```

**After:**
```typescript
import { __VIKE__IS_DEV } from 'virtual:vike:constants'

if (__VIKE__IS_DEV) {
  // development code
}
```

### Implementation Details

The virtual module is implemented in `pluginReplaceConstantsGlobalThis.ts` using Vite's virtual module system:
- `resolveId` hook handles module resolution
- `load` hook generates the module content dynamically based on environment
- Values are determined at build time for optimal performance

### Use Cases

- Conditional development/production code
- Client/server-specific logic
- Debug-only features
- Environment-specific configurations
- Tree-shaking optimizations
