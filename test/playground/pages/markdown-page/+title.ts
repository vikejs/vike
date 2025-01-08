import type { PageContext } from 'vike/types'

export default function (pageContext: PageContext): string {
  const title = pageContext.config.frontmatter!.title
  return title
}
