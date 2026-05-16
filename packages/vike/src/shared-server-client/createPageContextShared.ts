export { createPageContextShared }
export { createPageContextObject }
export type { PageContextCreated }

import { changeEnumerable } from '../utils/changeEnumerable.js'
import { objectAssign } from '../utils/objectAssign.js'
import type { GlobalConfigPublic } from './page-configs/resolveVikeConfigPublic.js'
import type { PageContextCreatedClient } from '../client/runtime-client-routing/createPageContextClient.js'
import type { PageContextCreatedServer } from '../server/runtime/renderPageServer/createPageContextServer.js'
import type { PageContextCreatedClient_ServerRouting } from '../client/runtime-server-routing/createPageContextClient.js'
import type { GlobalContextPublicMinimum } from './getGlobalContextPublicShared.js'

// Ideally we'd always use PageContextCreatedPrecise instead of PageContextCreated, but it turns out to be difficult
type PageContextCreated = {
  _isOriginalObject: true
  isPageContext: true
  isClientSide: boolean
  _globalContext: GlobalContextPublicMinimum
  // ... manually add common types here
}
type IsSubset<A, B> = B extends A ? true : false
// @ts-ignore unused type test
type _test = [
  Expect<IsSubset<PageContextCreated, PageContextCreatedServer>>,
  Expect<IsSubset<PageContextCreated, PageContextCreatedClient>>,
  Expect<IsSubset<PageContextCreated, PageContextCreatedClient_ServerRouting>>,
]
type Expect<T extends true> = T
// @ts-ignore Isn't used yet. It is unusable? See `PageContextCreated` comment above.
type PageContextCreatedPrecise =
  | PageContextCreatedServer
  | PageContextCreatedClient
  | PageContextCreatedClient_ServerRouting

function createPageContextShared<T extends Record<string, unknown>>(
  pageContextCreated: T,
  globalConfigPublic: GlobalConfigPublic,
) {
  objectAssign(pageContextCreated, globalConfigPublic)
  return pageContextCreated
}

function createPageContextObject() {
  // V8 hidden-class stability optimization — pre-declare commonly assigned pageContext fields
  // as `undefined` so V8 sees one stable shape across the request lifecycle.
  //
  // Background: pageContext is mutated by ~35 objectAssign() calls across the SSR pipeline,
  // adding fields in different orders depending on which conditional branches fire. Without
  // this pre-declaration, V8 creates many different hidden classes for what is logically the
  // same object — making property reads at hot call sites megamorphic and 1.5–2× slower than
  // they would be with a stable shape (microbenchmarked).
  //
  // The fields listed here are the well-known plain-data fields populated by the server-side
  // SSR path. Adding more does not change semantics for fields that are only used as
  // overwrite-on-assign data — only fields that get written later are affected; undeclared
  // fields will still cause one-shot shape transitions on first write.
  //
  // IMPORTANT: Four categories of fields must NOT be pre-declared:
  //
  //   1. Lazy-compute memoization markers checked via `'X' in pageContext` — currently
  //      `_pageAssets` (loadPageConfigsLazyServerSide.ts) and `_pageId` (getPageContextPublicShared.ts).
  //      Pre-declaring as `undefined` makes the `in` check spuriously true and short-circuits
  //      the compute path.
  //
  //   2. Fields in the built-in `passToClient` list (serializeContext.ts:28) that may stay
  //      undefined after the SSR path — currently `data`, `abortReason`, `abortStatusCode`.
  //      The client-side serializer (propKeys.ts:getPropVal) uses `key in obj` to gate
  //      serialization, so pre-declaring them causes spurious `"!undefined"` markers to land
  //      in the inlined `vike_pageContext` JSON.
  //
  //   3. Fields in the error-path passToClient list (serializeContext.ts:42), notably
  //      `pageProps` (also commonly added to user `passToClient`) and `is404` — same risk
  //      as (2), plus `is404` carries a `hasProp(pageContext, 'is404', 'boolean')` assertion
  //      that pre-declaration as `undefined` would silently break.
  //
  //   4. Fields that get explicitly assigned and then merged-back via the `objectAssign(target,
  //      forked_source, true)` pattern — currently `pageId`. In the abort path
  //      (renderPageServer.ts:668), `objectAssign(pageContext, pageContextErrorPageInit, true)`
  //      copies own property descriptors from a fork of the begin-state pageContext. If the
  //      fork carries `pageId: undefined` (because of pre-declaration), that overwrites the
  //      `pageId = errorPageId` set on the line above, causing the assertPageContext check in
  //      serializeContext to fail. `routeParams` is unaffected because the same call site
  //      explicitly assigns it to `{}` before the merge.
  //
  // NOTE: URL-computed accessor properties (`urlPathname`, `url`, `urlParsed`) are intentionally
  // omitted — they are installed via `Object.defineProperty` with getters by
  // `getPageContextUrlComputed()`, and pre-declaring them as data properties would cost an extra
  // shape transition when they get replaced with accessor descriptors.
  //
  // The cast preserves the original narrow return type — the additional `undefined` fields are
  // a runtime-only shape hint, not part of the API contract. Downstream code uses objectAssign()
  // to add fields with their concrete types (via the `asserts obj is Obj & ObjAddendum` signature).
  const pageContext = {
    _isOriginalObject: true as const,
    isPageContext: true as const,
    isClientSide: undefined,
    isPrerendering: undefined,
    _requestId: undefined,
    urlOriginal: undefined,
    headersOriginal: undefined,
    headers: undefined,
    _reqWeb: undefined,
    _reqDev: undefined,
    _globalContext: undefined,
    _pageFilesAll: undefined,
    _baseServer: undefined,
    _baseAssets: undefined,
    _pageContextInit: undefined,
    _urlHandler: undefined,
    isClientSideNavigation: undefined,
    // pageId intentionally NOT pre-declared — gets clobbered back to undefined by the
    // `objectAssign(pageContext, pageContextErrorPageInit, true)` merge in the abort path
    // (renderPageServer.ts:668), breaking assertPageContext.
    routeParams: undefined,
    // is404 intentionally NOT pre-declared — error-path passToClient + hasProp assertion.
    _pageConfig: undefined,
    exportsAll: undefined,
    exports: undefined,
    from: undefined,
    Page: undefined,
    _isHtmlOnly: undefined,
    _passToClient: undefined,
    __getPageAssets: undefined,
    // _pageAssets intentionally NOT pre-declared — lazy-compute marker
    // (`'_pageAssets' in pageContext` in loadPageConfigsLazyServerSide.ts).
    headersResponse: undefined,
    // data intentionally NOT pre-declared — built-in passToClient.
    _renderHook: undefined,
    _pageContextPromise: undefined,
    // pageProps intentionally NOT pre-declared — error-path passToClient + common user passToClient target.
    _cspNonce: undefined,
    pageContextsAborted: undefined,
    _isStream: undefined,
    errorWhileRendering: undefined,
    // abortReason / abortStatusCode intentionally NOT pre-declared — built-in passToClient.
    httpResponse: undefined,
  } as { _isOriginalObject: true; isPageContext: true }
  changeEnumerable(pageContext, '_isOriginalObject', false)
  return pageContext
}
