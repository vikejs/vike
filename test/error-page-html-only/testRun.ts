export { testRun }

import { run, page, test, expect, getServerUrl, expectLog, autoRetry, sleep } from '@brillout/test-e2e'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  run(cmd)
  const isDev = cmd === 'pnpm run dev'

  test('persistent hydration error: the page is loaded only once (no infinite reload loop)', async () => {
    const pageLoads = countPageLoads()
    try {
      await page.goto(getServerUrl() + '/hydration-error')
      await autoRetry(() => {
        expectLog('Some persistent client-side error', { filter: (log) => log.logSource === 'Browser Error' })
      })
      // The error page can't be rendered by the client-side, and the server already rendered the page: the server-side rendered page remains
      await sleep(1000)
      expect(pageLoads.get()).toBe(1)
      expect(await page.textContent('h1')).toBe('Hydration error')
      // Links still work: the page isn't hydrated, so Vike falls back to Server Routing
      await page.click('a[href="/"]')
      await autoRetry(() => expect(pageLoads.get()).toBe(2))
      await autoRetry(async () => expect(await page.textContent('h1')).toBe('Welcome'))
    } finally {
      pageLoads.stop()
    }
  })

  // Vike reloads the page upon failing to fetch static assets only in production
  if (!isDev) {
    test('persistent failure to fetch static assets: the page is reloaded only once (no infinite reload loop)', async () => {
      const pageLoads = countPageLoads()
      const url = '**/entries/pages_index.*.js'
      const context = page.context()
      // We use page.context() because page.unroute() doesn't work with the `page` proxy of @brillout/test-e2e
      await context.route(url, (route) => route.abort())
      try {
        await page.goto(getServerUrl() + '/')
        await autoRetry(() => {
          expectLog('Failed to fetch dynamically imported module', {
            filter: (log) => log.logSource === 'Browser Error',
          })
        })
        await sleep(1000)
        expect(pageLoads.get()).toBe(2)
        expect(await page.textContent('h1')).toBe('Welcome')
      } finally {
        pageLoads.stop()
        await context.unroute(url)
      }
      expectLog('Failed to load resource: net::ERR_FAILED', { filter: (log) => log.logSource === 'Browser Error' })
    })
  }
}

function countPageLoads() {
  let pageLoads = 0
  const onRequest = (request: { resourceType(): string }) => {
    if (request.resourceType() === 'document') pageLoads++
  }
  page.on('request', onRequest)
  return {
    get: () => pageLoads,
    stop: () => {
      page.removeListener('request', onRequest)
    },
  }
}
