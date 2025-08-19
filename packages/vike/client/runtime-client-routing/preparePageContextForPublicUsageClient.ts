export { preparePageContextForPublicUsageClient }
export type { PageContextForPublicUsageClient }

import { preparePageContextForPublicUsageClientShared } from '../shared/preparePageContextForPublicUsageClientShared.js'
import type { VikeConfigPublicPageLazyLoaded } from '../../shared/getPageFiles.js'
import type { PageContextInternalClient_ClientRouting } from '../../types/PageContext.js'
import type { PageContextPrepareMinimum } from '../../shared/preparePageContextForPublicUsage.js'

type PageContextForPublicUsageClient = PageContextPrepareMinimum &
  PageContextInternalClient_ClientRouting &
  VikeConfigPublicPageLazyLoaded & { urlOriginal: string }

function preparePageContextForPublicUsageClient<PageContext extends PageContextForPublicUsageClient>(
  pageContext: PageContext,
) {
  return preparePageContextForPublicUsageClientShared(pageContext)
}
