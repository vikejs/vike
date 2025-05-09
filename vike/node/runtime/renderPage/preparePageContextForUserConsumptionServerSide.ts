export { preparePageContextForUserConsumptionServerSide }
export type { PageContextForUserConsumptionServerSide }

import { PageContextUrlInternal } from '../../../shared/getPageContextUrlComputed.js'
import type { PageConfigUserFriendlyOld } from '../../../shared/page-configs/getUserFriendlyConfigs.js'
import { PageContextBuiltInServerInternal } from '../../../shared/types.js'
import { preparePageContextForUserConsumption } from '../../../shared/preparePageContextForUserConsumption.js'
import type { GlobalContextServer } from '../globalContext.js'

type PageContextForUserConsumptionServerSide = PageContextBuiltInServerInternal &
  PageConfigUserFriendlyOld & {
    urlOriginal: string
    /** @deprecated */
    url: string
    urlPathname: string
    urlParsed: PageContextUrlInternal['urlParsed']
    routeParams: Record<string, string>
    Page: unknown
    pageId: string
    is404: null | boolean
    isClientSideNavigation: boolean
    globalContext: GlobalContextServer
  } & Record<string, unknown>

function preparePageContextForUserConsumptionServerSide(pageContext: PageContextForUserConsumptionServerSide): void {
  preparePageContextForUserConsumption(pageContext)
}
