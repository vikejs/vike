export { testCounter }
export { hydrationDone }
export { ensureWasClientSideRouted }
export { expectUrl }

import { page, expect, getServerUrl, autoRetry, partRegex } from '@brillout/test-e2e'

async function testCounter() {
  // autoRetry() in case page just got client-side navigated
  await autoRetry(async () => {
    const btn = page.locator('button', { hasText: 'Counter' })
    expect(await btn.textContent()).toBe('Counter 0')
  })
  // autoRetry() in case page isn't hydrated yet
  await autoRetry(async () => {
    const btn = page.locator('button', { hasText: 'Counter' })
    await btn.click()
    expect(await btn.textContent()).toBe('Counter 1')
  })
}
async function hydrationDone() {
  await testCounter()
}

function expectUrl(pathname: string) {
  expect(page.url()).toBe(getServerUrl() + pathname)
}

/** Ensure page wasn't server-side routed */
async function ensureWasClientSideRouted(pageIdFirst: string) {
  // Check whether the HTML is from the first page before Client-side Routing.
  // page.content() doesn't return the original HTML (it dumps the DOM to HTML).
  // Therefore only the serialized pageContext tell us the original HTML.
  const html = await page.content()
  const pageId = findFirstPageId(html)
  expect(pageId).toBe(pageIdFirst)
}
function findFirstPageId(html: string) {
  expect(html).toContain('<script id="vite-plugin-ssr_pageContext" type="application/json">')
  expect(html).toContain('_pageId')
  expect(html.split('_pageId').length).toBe(2)
  const match = partRegex`"_pageId":"${/([^"]+)/}"`.exec(html)
  expect(match).toBeTruthy()
  const pageId = match![1]
  expect(pageId).toBeTruthy()
  return pageId
}
