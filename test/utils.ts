export { testCounter }
export { hydrationDone }
export { ensureWasClientSideRouted }
export { expectUrl }

import { page, expect, getServerUrl, autoRetry, partRegex } from '@brillout/test-e2e'

async function testCounter() {
  expect(await page.textContent('button')).toBe('Counter 0')
  // autoRetry() because browser-side code may not be loaded yet
  await autoRetry(async () => {
    await page.click('button')
    expect(await page.textContent('button')).toContain('Counter 1')
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
