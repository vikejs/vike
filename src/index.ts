import { assert } from './utils/assert'
import { higherFirst } from './utils/sorter'

export { PageConfig, addWindowType } from './types'
// export { renderToHtml };
export { getPage }

import { getPageDefinitions, Page } from './getPageDefinitions'

async function getPage(url: string): Promise<Page | null> {
  const pages = await getPageDefinitions()
  const matches = pages
    .filter((page) => !page.isDefaultTemplate)
    .map((page) => {
      const matchValue = page.matchesUrl(url)
      return { page, matchValue }
    })
    .filter(({ matchValue }) => matchValue !== false)
    .sort(
      higherFirst(({ matchValue }) => {
        assert(matchValue !== false)
        return matchValue === true ? 0 : matchValue
      })
    )
  if (matches.length === 0) {
    return null
  }
  return matches[0].page
}
