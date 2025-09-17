# Vike Virtual Constants Module

This document explains the new virtual module approach for accessing Vike constants in production environments.

## Problem Solved

Previously, Vike used `globalThis` variables (`__VIKE__IS_DEV`, `__VIKE__IS_CLIENT`, `__VIKE__IS_DEBUG`) that were set via Vite's `define` config. However, in production environments with `ssr.external`, these variables would remain `undefined` because Vite isn't loaded, causing reliability issues.

## Solution: Automatic Virtual Module Loading

Vike now provides a virtual module `virtual:vike:constants` that is automatically loaded to ensure `globalThis` variables are set reliably in all environments. The virtual module is automatically imported by Vike's entry points, so no code changes are required.

### Usage

The virtual module is automatically loaded, so you can continue using the existing `globalThis` variables without any changes:

```typescript
// Existing usage continues to work reliably
if (globalThis.__VIKE__IS_DEV) {
  console.log('Development mode enabled')
}

if (globalThis.__VIKE__IS_CLIENT) {
  console.log('Running in browser')
} else {
  console.log('Running on server')
}

if (globalThis.__VIKE__IS_CLIENT && globalThis.__VIKE__IS_DEBUG) {
  console.log('Debug mode enabled')
}
```

### Available Constants

- `globalThis.__VIKE__IS_DEV: boolean` - Like `import.meta.env.DEV` but works inside `node_modules/` (even if package is `ssr.external`)
- `globalThis.__VIKE__IS_CLIENT: boolean` - Like `import.meta.env.SSR` but inverted, works inside `node_modules/` (even if package is `ssr.external`)
- `globalThis.__VIKE__IS_DEBUG: boolean | undefined` - Whether debug flags are enabled (client-side only, always `undefined` on server-side)

### Benefits

1. **Reliable in Production**: Works correctly with `ssr.external` configurations
2. **Automatic Loading**: No code changes required - virtual module is loaded automatically
3. **Backward Compatible**: Existing code using `globalThis` variables continues to work
4. **Environment Safety**: Clear distinction between client/server availability
5. **Production Ready**: Eliminates `undefined` values in production environments

### No Migration Required

No code changes are needed! The virtual module is automatically loaded, ensuring that existing code using `globalThis` variables continues to work reliably:

```typescript
// This continues to work reliably in all environments
if (globalThis.__VIKE__IS_DEV) {
  // development code
}
```

### Implementation Details

The virtual module is implemented in `pluginReplaceConstantsGlobalThis.ts` using Vite's virtual module system:
- `resolveId` hook handles module resolution
- `load` hook generates the module content that sets `globalThis` variables
- Virtual module is automatically imported by Vike's entry points
- Values are determined at build time for optimal performance
- Works in both development and production environments

### Use Cases

- Conditional development/production code
- Client/server-specific logic
- Debug-only features
- Environment-specific configurations
- Tree-shaking optimizations
