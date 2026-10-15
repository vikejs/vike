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

  test('hydration retry: the page is reloaded if a new frontend was deployed', async () => {
    // Only the first page load references a page entry that doesn't exist anymore
    const pageEntry = await blockPageEntry((pageLoads) => pageLoads === 1 && 'deleted')
    try {
      await page.goto(getServerUrl() + '/')
      await testCounter()
      expect(pageEntry.getPageLoads()).toBe(2)
    } finally {
      await pageEntry.unblock()
    }
    expectLog('the server responded with a status of 404', { filter: (log) => log.logSource === 'Browser Error' })
  })

  test('hydration retry: the page is reloaded only once (no infinite reload loop)', async () => {
    // All page loads reference a page entry that doesn't exist anymore (e.g. the HTML is cached)
    const pageEntry = await blockPageEntry(() => 'deleted')
    try {
      await page.goto(getServerUrl() + '/')
      // The reloaded page doesn't reload again: it throws the error and the server-side rendered page remains
      await autoRetry(() => {
        expectLog('Failed to fetch dynamically imported module', { filter: (log) => log.logSource === 'Browser Error' })
      })
      expectLog('Failed to fetch static asset (due to a connection issue, or a new deployment)', {
        filter: (log) => log.logSource === 'Browser Log',
      })
      await sleep(1000)
      expect(pageEntry.getPageLoads()).toBe(2)
      expect(await page.textContent('h1')).toBe('Welcome')
    } finally {
      await pageEntry.unblock()
    }
    expectLog('the server responded with a status of 404', { filter: (log) => log.logSource === 'Browser Error' })
  })

  test('hydration retry: the page is reloaded if the connection is back', async () => {
    // The first page load fails to fetch the page's entry, but the connection is back when Vike checks whether the server responds
    const pageEntry = await blockPageEntry((pageLoads) => pageLoads === 1 && 'network-error')
    try {
      await page.goto(getServerUrl() + '/')
      await testCounter()
      expect(pageEntry.getPageLoads()).toBe(2)
    } finally {
      await pageEntry.unblock()
    }
    expectLog('Failed to load resource: net::ERR_FAILED', { filter: (log) => log.logSource === 'Browser Error' })
  })

  test("hydration retry: the page isn't reloaded when offline", async () => {
    const context = page.context()
    // The first page load fails to fetch the page's entry because the connection is lost
    const pageEntry = await blockPageEntry((pageLoads) => pageLoads === 1 && 'network-error', {
      onNetworkError: async () => {
        // Lose the connection only after Vike's client runtime is loaded
        await page.waitForLoadState('domcontentloaded')
        await context.setOffline(true)
      },
    })
    try {
      await page.goto(getServerUrl() + '/')
      // It throws the error and the server-side rendered page remains, also after the connection is back
      await autoRetry(() => {
        expectLog('Failed to fetch dynamically imported module', { filter: (log) => log.logSource === 'Browser Error' })
      })
      expectLog('Failed to fetch static asset (due to a connection issue, or a new deployment)', {
        filter: (log) => log.logSource === 'Browser Log',
      })
      await context.setOffline(false)
      await sleep(1000)
      expect(pageEntry.getPageLoads()).toBe(1)
      expect(await page.textContent('h1')).toBe('Welcome')
    } finally {
      await context.setOffline(false)
      await pageEntry.unblock()
    }
    expectLog('Failed to load resource', { filter: (log) => log.logSource === 'Browser Error' })
  })

  test('hydration retry: an SPA is reloaded without checking the connection', async () => {
    // The first page load fails to fetch the page's entry
    const pageEntry = await blockPageEntry((pageLoads) => pageLoads === 1 && 'network-error', { pageName: 'spa' })
    try {
      await page.goto(getServerUrl() + '/spa')
      // The page is blank: reloading it is better, even if the connection is down
      await testCounter()
      expect(pageEntry.getPageLoads()).toBe(2)
      expect(pageEntry.getConnectionChecks()).toBe(0)
    } finally {
      await pageEntry.unblock()
    }
    expectLog('Failed to load resource: net::ERR_FAILED', { filter: (log) => log.logSource === 'Browser Error' })
  })
}
// Make fetching the page's entry fail:
// - 'deleted': the entry doesn't exist anymore (e.g. a new frontend was deployed)
// - 'network-error': the entry exists but fetching it fails (e.g. flaky connection), while the server still responds to Vike's connection check — unless `onNetworkError()` takes the connection down
async function blockPageEntry(
  getFailure: (pageLoads: number) => 'deleted' | 'network-error' | false,
  { pageName = 'index', onNetworkError }: { pageName?: string; onNetworkError?: () => Promise<void> } = {},
) {
  const url = `**/entries/pages_${pageName}.*.js`
  let pageLoads = 0
  let connectionChecks = 0
  const onRequest = (request: { resourceType(): string; method(): string }) => {
    if (request.resourceType() === 'document') pageLoads++
    // Vike checks the connection with a HEAD request
    if (request.method() === 'HEAD') connectionChecks++
  }
  page.on('request', onRequest)
  // We use page.context() because page.unroute() doesn't work with the `page` proxy of @brillout/test-e2e
  const context = page.context()
  await context.route(url, async (route) => {
    const failure = getFailure(pageLoads)
    if (failure === 'deleted') return route.fulfill({ status: 404 })
    if (failure === 'network-error') {
      await onNetworkError?.()
      return route.abort()
    }
    return route.continue()
  })
  return {
    getPageLoads: () => pageLoads,
    getConnectionChecks: () => connectionChecks,
    // Call it in a `finally` block: the route is set on the browser context, which is shared with the next tests
    unblock: async () => {
      page.removeListener('request', onRequest)
      await context.unroute(url)
    },
  }
}
