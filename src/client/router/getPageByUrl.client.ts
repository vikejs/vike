import { assert } from '../../utils'
import { getPageProps } from './getPageProps.client'
import { getPageId } from './getPageId.client'
import { getPageById } from '../getPage.client'

export { getPageByUrl }

async function getPageByUrl(url: string): Promise<{ Page: unknown; pageProps: Record<string, unknown> }> {
  const [Page, pageProps] = await Promise.all([
    (async () => await getPageById(await getPageId(url)))(),
    (async () => await getPageProps(url))()
  ])
  assert(pageProps.constructor === Object)
  return { Page, pageProps }
}
