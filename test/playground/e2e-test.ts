export { testOtherFrameworkNavigation }
export { testHydrationRetry }

import { test, page, getServerUrl, expect, expectLog, autoRetry, sleep } from '@brillout/test-e2e'
import { expectUrl, testCounter, waitForNavigation } from '../utils'

function testOtherFrameworkNavigation() {
  test('navigate from another SPA framework', async () => {
    await page.goto(getServerUrl() + '/other-framework.html')

    let navPromise = await waitForNavigation()
    await page.click('a[href="/star-wars"]')
    // Page full reload
    await navPromise()

    await expectUrl('/star-wars')
    expect(await page.textContent('body')).toContain('Star Wars Movies')
    await testCounter()

    navPromise = await waitForNavigation()
    await page.goBack()
    // Page should fully reload because we are exiting Vike land
    await navPromise()

    await expectUrl('/other-framework.html')
    expect(await page.textContent('body')).toContain('Other Framework Page')
  })
}

// https://github.com/vikejs/vike/issues/3596
function testHydrationRetry(isDev: boolean) {
  // Vike reloads the page only in production
  if (isDev) return

  test('hydration retry: the page is reloaded upon failing to fetch static assets', async () => {
    // Only the first page load fails to fetch the page's entry
    const pageEntry = await blockPageEntry((pageLoads) => pageLoads === 1)
    await page.goto(getServerUrl() + '/')
    await testCounter()
    expect(pageEntry.getPageLoads()).toBe(2)
    await pageEntry.unblock()
    expectLog('Failed to load resource: net::ERR_FAILED', { filter: (log) => log.logSource === 'Browser Error' })
  })

  test('hydration retry: when offline, the page is reloaded after the connection is back', async () => {
    const context = page.context()
    // The first page load fails to fetch the page's entry because the connection is lost
    const pageEntry = await blockPageEntry(
      (pageLoads) => pageLoads === 1,
      async () => {
        // Lose the connection only after Vike's client runtime is loaded
        await page.waitForLoadState('domcontentloaded')
        await context.setOffline(true)
      },
    )
    await page.goto(getServerUrl() + '/')
    // The page isn't reloaded while offline: the server-side rendered page remains
    await sleep(1000)
    expect(pageEntry.getPageLoads()).toBe(1)
    expect(await page.textContent('h1')).toBe('Welcome')
    await context.setOffline(false)
    await testCounter()
    expect(pageEntry.getPageLoads()).toBe(2)
    await pageEntry.unblock()
    expectLog('Failed to load resource', { filter: (log) => log.logSource === 'Browser Error' })
  })

  test('hydration retry: the page is reloaded only once (no infinite reload loop)', async () => {
    // All page loads fail to fetch the page's entry
    const pageEntry = await blockPageEntry(() => true)
    await page.goto(getServerUrl() + '/')
    // The reloaded page doesn't reload again: it handles the error like any other error, i.e. it logs it and renders the error page — which the playground doesn't define
    await autoRetry(() => {
      expectLog('No error page defined.', { filter: (log) => log.logSource === 'Browser Error' })
    })
    expectLog('Failed to fetch dynamically imported module', { filter: (log) => log.logSource === 'Browser Error' })
    expect(pageEntry.getPageLoads()).toBe(2)
    await pageEntry.unblock()
    expectLog('Failed to load resource: net::ERR_FAILED', { filter: (log) => log.logSource === 'Browser Error' })
  })
}
async function blockPageEntry(isBlocked: (pageLoads: number) => boolean, onBlock?: () => Promise<void>) {
  const url = '**/entries/pages_index.*.js'
  let pageLoads = 0
  const onRequest = (request: { resourceType(): string }) => {
    if (request.resourceType() === 'document') pageLoads++
  }
  page.on('request', onRequest)
  // We use page.context() because page.unroute() doesn't work with the `page` proxy of @brillout/test-e2e
  const context = page.context()
  await context.route(url, async (route) => {
    if (!isBlocked(pageLoads)) return route.continue()
    await onBlock?.()
    return route.abort()
  })
  return {
    getPageLoads: () => pageLoads,
    unblock: async () => {
      page.removeListener('request', onRequest)
      await context.unroute(url)
    },
  }
}
