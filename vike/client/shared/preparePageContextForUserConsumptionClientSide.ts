export { preparePageContextForUserConsumptionClientSide }
export type { PageContextForUserConsumptionClientSide }

import { objectAssign } from '../server-routing-runtime/utils.js'
import type { PageConfigUserFriendlyOld } from '../../shared/getPageFiles.js'
import { getPageContextProxyForUser } from './getPageContextProxyForUser.js'
import { preparePageContextForUserConsumption } from '../../shared/preparePageContextForUserConsumption.js'
import { assertPageContextUrls } from '../../shared/getPageContextUrlComputed.js'

type PageContextForUserConsumptionClientSide = PageConfigUserFriendlyOld & {
  urlOriginal: string
}

function preparePageContextForUserConsumptionClientSide<T extends PageContextForUserConsumptionClientSide>(
  pageContext: T
): T & { Page: unknown } {
  // TODO/now
  const Page =
    pageContext.config.Page ||
    // TODO/next-major-release: remove
    pageContext.exports.Page
  objectAssign(pageContext, { Page })

  // TODO/next-major-release: after we remove supportVueReactiviy() we can call this later inside the agnostic preparePageContextForUserConsumption()
  assertPageContextUrls(pageContext)
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
