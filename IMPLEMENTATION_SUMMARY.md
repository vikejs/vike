# Fix for Client-Side Guard Execution on Page Reload

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

## Solution
We implemented a comprehensive fix with the following changes:

### 1. Added `guardEnv` computed property
**File:** `packages/vike/node/vite/shared/resolveVikeConfigInternal/configDefinitionsBuiltIn.ts`

Added a computed property to track guard environment configuration, similar to `dataEnv` and `onBeforeRenderEnv`.

### 2. Extended `hookClientOnlyExists` function
**File:** `packages/vike/client/runtime-client-routing/getPageContextFromHooks.ts`

Extended the function to support guard hooks in addition to data and onBeforeRender hooks.

### 3. Updated guard execution logic
**File:** `packages/vike/client/runtime-client-routing/getPageContextFromHooks.ts`

**After (fixed):**
```typescript
if (hookName === 'guard') {
  if (
    !isErrorPage &&
    // Execute guard() if:
    // 1. We don't have pageContext from server (client-side navigation), OR
    // 2. The guard is client-only (needs to run even during hydration)
    (!pageContext._hasPageContextFromServer || hookClientOnlyExists(hookName, pageContext))
  ) {
    await execHookGuard(pageContext, (pageContext) => preparePageContextForPublicUsageClient(pageContext))
  }
}
```

### 4. Added hydration support
**File:** `packages/vike/client/runtime-client-routing/getPageContextFromHooks.ts`

Added client-only guard execution during hydration:
```typescript
async function getPageContextFromHooks_isHydration(pageContext) {
  // Execute client-only guard hooks during hydration
  if (hookClientOnlyExists('guard', pageContext)) {
    await execHookGuard(pageContext, (pageContext) => preparePageContextForPublicUsageClient(pageContext))
  }
  // ... rest of hydration logic
}
```

### 5. Updated documentation
**File:** `docs/pages/guard/+Page.mdx`

Added documentation for `+guard.client.js` explaining that it executes on both page reload and client-side navigation.

## Result
Now the guard execution works correctly:
- Page reload with client-only guard: `_hasPageContextFromServer = true` + `hookClientOnlyExists = true` → guard executed ✅
- Client navigation with client-only guard: `_hasPageContextFromServer = false` → guard executed ✅
- Page reload with server-only guard: `_hasPageContextFromServer = true` + `hookClientOnlyExists = false` → guard NOT executed ✅
- Client navigation with server-only guard: `_hasPageContextFromServer = false` → guard executed ✅

## Testing
Created a verification script that confirms the logic works correctly for all scenarios. The fix ensures that:
1. Client-only guards execute on page reload (FIXED the main issue)
2. Client-only guards still execute on navigation (preserved existing behavior)
3. Server-only guards are not executed unnecessarily on the client (preserved existing behavior)
4. Regular guards continue to work as expected during navigation (preserved existing behavior)
