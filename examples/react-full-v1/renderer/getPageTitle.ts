export { getPageTitle }

import type { PageContext } from './types'

function getPageTitle(pageContext: PageContext): string {
  const title = pageContext.title || pageContext.config.title || 'Demo'
  return title
}
