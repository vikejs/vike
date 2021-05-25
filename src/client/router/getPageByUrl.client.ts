import { assert, isPlainObject } from '../../utils'
import { getPageContext } from './getPageContext.client'
import { getPageById } from '../getPage.client'

export { getPageByUrl }

async function getPageByUrl(
  url: string,
  useOriginalDataWhenPossible: boolean = true
): Promise<{ Page: unknown; pageContext: Record<string, unknown> }> {
  const pageContext = await getPageContext(url, useOriginalDataWhenPossible)
  assert(isPlainObject(pageContext))
  assert(typeof pageContext.pageId === 'string')
  const Page = await getPageById(pageContext.pageId)
  return { Page, pageContext }
}
