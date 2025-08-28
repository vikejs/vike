export { preparePageContextForPublicUsageClientShared }
export { preparePageContextForPublicUsageClientMinimal }
export type { PageContextForPublicUsageClientShared }

import { objectAssign } from '../runtime-server-routing/utils.js'
import type { PageContextConfig } from '../../shared/getPageFiles.js'
import {
  assertPropertyGetters,
  type PageContextPrepareMinimum,
  preparePageContextForPublicUsage,
} from '../../shared/preparePageContextForPublicUsage.js'
import type { PageContextInternalClient } from '../../types/PageContext.js'

type PageContextForPublicUsageClientShared = PageContextPrepareMinimum & PageContextInternalClient & PageContextConfig

function preparePageContextForPublicUsageClientShared<PageContext extends PageContextForPublicUsageClientShared>(
  pageContext: PageContext,
): PageContext & { Page: unknown } {
  // TO-DO/soon/proxy: use proxy
  const Page =
    pageContext.config?.Page ||
    // TO-DO/next-major-release: remove
    pageContext.exports?.Page
  objectAssign(pageContext, { Page })

  // TO-DO/next-major-release: after we remove supportVueReactiviy() we can call this later inside the agnostic preparePageContextForPublicUsage()
  assertPropertyGetters(pageContext)
  // TO-DO/next-major-release: remove
  // - Requires https://github.com/vikejs/vike-vue/issues/198
  // - Last time I tried to remove it (https://github.com/vikejs/vike/commit/705fd23598d9d69bf46a52c8550216cd7117ce71) the tests were failing as expected: only the Vue integrations that used shallowReactive() failed.
  supportVueReactiviy(pageContext)

  return preparePageContextForPublicUsageClientMinimal(pageContext)
}

function preparePageContextForPublicUsageClientMinimal<PageContext extends PageContextPrepareMinimum>(
  pageContext: PageContext,
) {
  const pageContextPublic = preparePageContextForPublicUsage(pageContext)
  return pageContextPublic
}

// With Vue + Client Routing, the `pageContext` is made reactive:
// ```js
// import { reactive } from 'vue'
// // See /examples/vue-full/renderer/createVueApp.ts
// const pageContextReactive = reactive(pageContext)
// ```
function supportVueReactiviy(pageContext: Record<string, unknown>) {
  resolveGetters(pageContext)
}
// Remove property descriptor getters because they break Vue's reactivity.
// E.g. resolve the `pageContext.urlPathname` getter.
function resolveGetters(pageContext: Record<string, unknown>) {
  Object.entries(pageContext).forEach(([key, val]) => {
    delete pageContext[key]
    pageContext[key] = val
  })
}
