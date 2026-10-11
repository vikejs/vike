export { testRun }

import { run, page, test, expect, getServerUrl, expectLog, autoRetry, sleep } from '@brillout/test-e2e'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  run(cmd)

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
