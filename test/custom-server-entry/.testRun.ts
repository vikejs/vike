export { testRun }

import { test, expect, fetch, fetchHtml, getServerUrl } from '@brillout/test-e2e'
import { testRunClassic } from '../utils'

function testRun(...args: Parameters<typeof testRunClassic>) {
  testRunClassic(...args)

  test('+server.ts route', async () => {
    // Also overrides the +middleware handler `overridden`
    expect(await fetchHtml('/hello')).toBe('Hello from +server.ts')
  })

  test("A +middleware runs before the app's own routes, in its order and with the context of the ones before it", async () => {
    expect((await fetch(`${getServerUrl()}/api/me`)).status).toBe(401)
    const response: Response = await fetch(`${getServerUrl()}/api/me`, { headers: { 'x-user': 'alice' } })
    expect(await response.text()).toBe('Me')
  })

  test("A +middleware handler runs after the app's own routes", async () => {
    expect(await fetchHtml('/from-middleware')).toBe('Hello from +middleware')
  })

  test("`vike.fetch()` doesn't render the page for a method the pages don't list (PROPFIND)", async () => {
    expect((await fetch(`${getServerUrl()}/`, { method: 'PROPFIND' })).status).toBe(404)
  })
}
