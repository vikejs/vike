export { getTitle }

import type { PageContext } from 'vike/types'

function getTitle(pageContext: PageContext): string {
  const title = pageContext.config.frontmatter?.title ?? pageContext.config['document.title'] ?? ''
  return title
}
