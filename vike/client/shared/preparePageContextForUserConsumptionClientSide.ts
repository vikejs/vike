export { preparePageContextForUserConsumptionClientSide }
export type { PageContextForUserConsumptionClientSide }

import { assert, objectAssign } from '../server-routing-runtime/utils.js'
import type { PageContextExports } from '../../shared/getPageFiles.js'
import type { PageContextClient, PageContextClientWithServerRouting } from '../../shared/types.js'
import type { PageConfigRuntime } from '../../shared/page-configs/PageConfig.js'
import { getPageContextProxyForUser, PageContextForPassToClientWarning } from './getPageContextProxyForUser.js'
import { preparePageContextForUserConsumption } from '../../shared/preparePageContextForUserConsumption.js'

type PageContextForUserConsumptionClientSide = PageContextExports &
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

  preparePageContextForUserConsumption(pageContext)

  const pageContextProxy = getPageContextProxyForUser(pageContext)
  return pageContextProxy
}
