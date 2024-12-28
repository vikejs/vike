export { retrievePageContext }

import { autoRetry, expect, fetchHtml, getServerUrl, page } from '@brillout/test-e2e'
import { extractPageContext } from './serializePageContext'

async function retrievePageContext(pathname: string, options?: { clientSide?: boolean }) {
  if (options?.clientSide) {
    await page.goto(getServerUrl() + pathname)
    // `autoRetry` because browser-side code may not be loaded yet
    return await autoRetry(async () => {
      const text = await page.textContent('#serialized-settings')
      const { pageContextSubset, isBrowser } = extractPageContext(text)
      expect(isBrowser).toBe(true)
      return { ...pageContextSubset, isBrowser }
    })
  } else {
    const html = await fetchHtml(pathname)
    const { pageContextSubset, isBrowser } = extractPageContext(html)
    return { ...pageContextSubset, isBrowser }
  }
}
