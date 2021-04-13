import { assert } from '../../utils'
import { getPageProps } from './getPageProps.client'
import { getPageId } from './getPageId.client'
import { getPageById } from '../getPage.client'

export { getPageByUrl }

async function getPageByUrl(
  url: string,
  useOriginalDataWhenPossible: boolean = true,
  includeRoutes: boolean = true
): Promise<{ Page: unknown; pageProps: Record<string, unknown> }> {
  const [Page, pageProps] = await Promise.all([
    (async () => await getPageById(await getPageId(url, useOriginalDataWhenPossible)))(),
    (async () => await getPageProps(url, useOriginalDataWhenPossible, includeRoutes))()
  ])
  assert(pageProps.constructor === Object)
  return { Page, pageProps }
}
