import { autoRetry, fetchHtml, getServerUrl, page } from '@brillout/test-e2e'
import { extractPageContext } from './serializePageContext'

export async function retrievePageContext(pathname: string, options?: { clientSide?: boolean }) {
  let jsonText: string | undefined | null = null
  if (options?.clientSide) {
    await page.goto(getServerUrl() + pathname)
    // `autoRetry` because browser-side code may not be loaded yet
    return await autoRetry(async () => {
      const text = await page.textContent('#serialized-settings')
      return extractPageContext(text, { expect: { isBrowser: true } })
    })
  } else {
    const html = await fetchHtml(pathname)
    return extractPageContext(html)
  }
}
