# SIMPLIFIED Fix for Client-Side Guard Execution on Page Reload

## Problem
The issue was that `+guard.client.js` files were not being executed on page reload (first page visit), only during client-side navigation. This was because the guard execution logic incorrectly assumed that if `_hasPageContextFromServer` was true, then all guards had already been executed on the server.

However, client-side guards by definition should only run on the client, so they need to be executed even when `_hasPageContextFromServer` is true.

## Root Cause
The problem was in `packages/vike/client/runtime-client-routing/getPageContextFromHooks.ts`:

**Before (broken):**
```typescript
if (hookName === 'guard') {
  if (
    !isErrorPage &&
    // We don't need to call guard() on the client-side if we fetch pageContext from the server side
    !pageContext._hasPageContextFromServer
  ) {
    await execHookGuard(pageContext, (pageContext) => preparePageContextForPublicUsageClient(pageContext))
  }
}
```

This logic meant:
- Page reload: `_hasPageContextFromServer = true` → guard NOT executed ❌
- Client navigation: `_hasPageContextFromServer = false` → guard executed ✅

## SIMPLIFIED Solution
Instead of complex environment tracking, we took a much simpler approach: **always execute client-only guards**, regardless of `_hasPageContextFromServer`. This is clean and logical since client-only guards should always run on the client.

### Key Changes Made

1. **Added `guardClientOnlyExists()` function** - Simple function that checks if a guard is client-only by looking at the file path (contains `.client.`).

2. **Updated guard execution logic** - Modified the condition to execute guards if either:
   - We don't have pageContext from server (client-side navigation), OR
   - The guard is client-only (always execute these)

3. **Updated hydration logic** - Client-only guards now execute during the hydration process.

4. **Updated documentation** - Added clear documentation about `+guard.client.js` behavior.

### Implementation Details

**New logic (fixed):**
```typescript
if (hookName === 'guard') {
  if (
    !isErrorPage &&
    // Execute guard() if:
    // 1. We don't have pageContext from server (client-side navigation), OR
    // 2. The guard is client-only (always execute client-only guards)
    (!pageContext._hasPageContextFromServer || guardClientOnlyExists(pageContext))
  ) {
    await execHookGuard(pageContext, (pageContext) => preparePageContextForPublicUsageClient(pageContext))
  }
}
```

**Client-only detection:**
```typescript
function guardClientOnlyExists(pageContext) {
  // Check if there's a guard hook defined
  const guardConfig = getConfigValueRuntime(pageConfig, 'guard')
  if (!guardConfig) return false
  
  // Check if it's client-only by looking at the file environment
  // If the guard is defined in a .client.js file, it's client-only
  const filePath = guardConfig.definedAtData?.filePathToShowToUser || ''
  return filePath.includes('.client.')
}
```

## Result
Now the guard execution works correctly:
- Page reload with client-only guard: `_hasPageContextFromServer = true` + `guardClientOnlyExists = true` → guard executed ✅
- Client navigation with client-only guard: `_hasPageContextFromServer = false` → guard executed ✅
- Page reload with server-only guard: `_hasPageContextFromServer = true` + `guardClientOnlyExists = false` → guard NOT executed ✅
- Client navigation with server-only guard: `_hasPageContextFromServer = false` → guard executed ✅

## Benefits of Simplified Approach
1. **Much simpler logic** - No need for complex environment tracking or computed properties
2. **Clear intent** - Client-only guards always run on client, which is intuitive
3. **Minimal changes** - Only added one helper function and updated the condition
4. **Backward compatible** - Doesn't break any existing functionality
5. **Easy to understand** - The logic is straightforward: "if it's client-only, always run it"

The fix ensures that `+guard.client.js` works correctly on both page reload and client-side navigation, solving the original issue with a clean, simple approach.
