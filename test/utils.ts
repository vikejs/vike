export { testRunClassic }
export { testCounter }
export { ensureWasClientSideRouted }
export { expectUrl }
export { expectPageContextJsonRequest }
export { waitForNavigation }
export { sleepBeforeEditFile }

import {
  page,
  test,
  expect,
  run,
  autoRetry,
  fetchHtml,
  getServerUrl,
  expectLog,
  partRegex,
  sleep,
  skip
} from '@brillout/test-e2e'

async function testCounter(currentValue = 0) {
  // autoRetry() in case page just got client-side navigated
  await autoRetry(
    async () => {
      const btn = page.locator('button', { hasText: 'Counter' })
      expect(await btn.textContent()).toBe(`Counter ${currentValue}`)
    },
    { timeout: 5 * 1000 }
  )
  // autoRetry() in case page isn't hydrated yet
  await autoRetry(
    async () => {
      const btn = page.locator('button', { hasText: 'Counter' })
      await btn.click()
      expect(await btn.textContent()).toBe(`Counter ${currentValue + 1}`)
    },
    { timeout: 5 * 1000 }
  )
}

async function expectUrl(pathname: string) {
  await autoRetry(
    async () => {
      expect(page.url()).toBe(getServerUrl() + pathname)
      /* Same?
    const url = await page.evaluate(() => location.href)
    expect(url.endsWith(pathname)).toBe(true)
    //*/
    },
    { timeout: 3000 }
  )
}

/** Ensure page wasn't server-side routed.
 *
 * Examples:
 *   await ensureWasClientSideRouted('/pages/index')
 *   await ensureWasClientSideRouted('/pages/about')
 */
async function ensureWasClientSideRouted(pageIdFirst: `/pages/${string}`) {
  // Check whether the HTML is from the first page before Client-side Routing.
  // page.content() doesn't return the original HTML (it dumps the DOM to HTML).
  // Therefore only the serialized pageContext tell us the original HTML.
  const html = await page.content()
  const pageId = findFirstPageId(html)
  expect(pageId).toBe(pageIdFirst)
}
function findFirstPageId(html: string) {
  expect(html).toContain('<script id="vike_pageContext" type="application/json">')
  expect(html).toContain('pageId')
  expect(html.split('pageId').length).toBe(2)
  const match = partRegex`"pageId":"${/([^"]+)/}"`.exec(html)
  expect(match).toBeTruthy()
  const pageId = match![1]
  expect(pageId).toBeTruthy()
  return pageId
}

function expectPageContextJsonRequest(shouldExist: boolean) {
  const reqs: string[] = []
  const listener = (request: any) => reqs.push(request.url())
  page.on('request', listener)
  return () => {
    page.removeListener('request', listener)
    const count = reqs.filter((url) => url.endsWith('.pageContext.json')).length
    const exists = count > 0
    expect(exists).toBe(shouldExist)
  }
}

/** Wait for a full page navigation/reload (i.e. complete DOM de-/reconstruction)
 *
 * Reliable alternative to Playwright's:
 *  - page.waitForURL() which doesn't work for page reloads (https://github.com/microsoft/playwright/issues/20853)
 *  - page.waitForNavigation() which is unreliable (https://github.com/microsoft/playwright/issues/20853#issuecomment-1698770812)
 */
async function waitForNavigation(): Promise<() => Promise<void>> {
  // We need to await page.evaluate() before the page navigation is triggered, otherwise Playwright throws:
  // ```bash
  // proxy.evaluate: Execution context was destroyed, most likely because of a navigation
  // ```
  await page.evaluate(() => (window._stamp = true))
  return async () => {
    await page.waitForFunction(() => window._stamp === undefined)
  }
}
declare global {
  var _stamp: undefined | true
}

function testRunClassic(
  cmd: 'npm run dev' | 'npm run preview' | 'npm run prod',
  { isCJS, skipAboutPage, skipViteEcosystemCi }: { isCJS?: true; skipAboutPage?: true; skipViteEcosystemCi?: true } = {}
) {
  if (skipViteEcosystemCi && process.env.VITE_ECOSYSTEM_CI) {
    skip("SKIPPED: skipping this test from Vite's ecosystem CI, see https://github.com/vikejs/vike/pull/2220")
    return
  }

  run(cmd)

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Welcome</h1>')
    if (isCJS) {
      expectLog('package.json#type to "module", see https://vike.dev/CJS', {
        filter: (log) => log.logSource === 'stderr'
      })
    }
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(getServerUrl() + '/')
    await page.click('a[href="/"]')
    expect(await page.textContent('h1')).toBe('Welcome')
    await testCounter()
  })

  if (!skipAboutPage) {
    test('about page', async () => {
      await page.click('a[href="/about"]')
      await autoRetry(async () => {
        expect(await page.textContent('h1')).toBe('About')
      })
      expect(await page.textContent('p')).toBe('Example of using Vike.')
      const html = await fetchHtml('/about')
      expect(html).toContain('<h1>About</h1>')
    })
  }
}

/** Call it before `editFile()` and `editFileRevert()` to make these reliable.
 *
 * It doesn't seem to be always needed.
 *
 * I don't know why it's sometimes needed, there seem to be some kind of race condition?
 */
async function sleepBeforeEditFile() {
  await sleep(500)
}
