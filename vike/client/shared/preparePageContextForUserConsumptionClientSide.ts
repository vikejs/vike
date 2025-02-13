export { preparePageContextForUserConsumptionClientSide }
export type { PageContextForUserConsumptionClientSide }

import { assert, objectAssign } from '../server-routing-runtime/utils.js'
import type { PageConfigUserFriendlyOld } from '../../shared/getPageFiles.js'
import type { PageContextClient, PageContextClientWithServerRouting } from '../../shared/types.js'
import type { PageConfigRuntime } from '../../shared/page-configs/PageConfig.js'
import { getPageContextProxyForUser, PageContextForPassToClientWarning } from './getPageContextProxyForUser.js'
import { preparePageContextForUserConsumption } from '../../shared/preparePageContextForUserConsumption.js'

type PageContextForUserConsumptionClientSide = PageConfigUserFriendlyOld &
  PageContextForPassToClientWarning & {
    pageId: string
    _pageConfigs: PageConfigRuntime[]
  }

function preparePageContextForUserConsumptionClientSide<T extends PageContextForUserConsumptionClientSide>(
  pageContext: T,
  isClientRouting: boolean
): T & { Page: unknown } {
  if (isClientRouting) {
    const pageContextTyped = pageContext as any as PageContextClient
    assert([true, false].includes(pageContextTyped.isHydration))
    assert([true, false, null].includes(pageContextTyped.isBackwardNavigation))
  } else {
    const pageContextTyped = pageContext as any as PageContextClientWithServerRouting
    assert(pageContextTyped.isHydration === true)
    assert(pageContextTyped.isBackwardNavigation === null)
  }

  const Page =
    pageContext.config.Page ||
    // TODO/next-major-release: remove
    pageContext.exports.Page
  objectAssign(pageContext, { Page })

  // TODO/next-major-release: remove
  // - Requires https://github.com/vikejs/vike-vue/issues/198
  // - Last time I tried to remove it (https://github.com/vikejs/vike/commit/705fd23598d9d69bf46a52c8550216cd7117ce71) the tests were failing as expected: only the Vue integrations that used shallowReactive() failed.
  supportVueReactiviy(pageContext)

  preparePageContextForUserConsumption(pageContext)

  const pageContextProxy = getPageContextProxyForUser(pageContext)
  return pageContextProxy
}

// With Vue + Cient Routing, the `pageContext` is made reactive:
// ```js
// import { reactive } from 'vue'
// // See /examples/vue-full/renderer/createVueApp.ts
// const pageContextReactive = reactive(pageContext)
// ```
function supportVueReactiviy(pageContext: Record<string, unknown>) {
  resolveGetters(pageContext)
}
// Remove propery descriptor getters because they break Vue's reactivity.
// E.g. resolve the `pageContext.urlPathname` getter.
function resolveGetters(pageContext: Record<string, unknown>) {
  Object.entries(pageContext).forEach(([key, val]) => {
    delete pageContext[key]
    pageContext[key] = val
  })
}
