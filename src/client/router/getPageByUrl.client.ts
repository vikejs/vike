import { assert } from '../../utils'
import { getContextProps } from './getContextProps.client'
import { getPageId } from './getPageId.client'
import { getPageById } from '../getPage.client'

export { getPageByUrl }

async function getPageByUrl(
  url: string,
  useOriginalDataWhenPossible: boolean = true
): Promise<{ Page: unknown; contextProps: Record<string, unknown> }> {
  const [Page, contextProps] = await Promise.all([
    (async () => await getPageById(await getPageId(url, useOriginalDataWhenPossible)))(),
    (async () => await getContextProps(url, useOriginalDataWhenPossible))()
  ])
  assert(contextProps.constructor === Object)
  return { Page, contextProps }
}
