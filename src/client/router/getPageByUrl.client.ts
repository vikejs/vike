import { assert, isPlainObject } from '../../utils'
import { getPageContext } from './getPageContext.client'
import { getPageId } from './getPageId.client'
import { getPageById } from '../getPage.client'

export { getPageByUrl }

async function getPageByUrl(
  url: string,
  useOriginalDataWhenPossible: boolean = true
): Promise<{ Page: unknown; pageContext: Record<string, unknown> }> {
  const [Page, pageContext] = await Promise.all([
    (async () => await getPageById(await getPageId(url, useOriginalDataWhenPossible)))(),
    (async () => await getPageContext(url, useOriginalDataWhenPossible))()
  ])
  assert(isPlainObject(pageContext))
  return { Page, pageContext }
}
