export { testRun }

import { test, expect, expectLog, fetch, fetchHtml, getServerUrl } from '@brillout/test-e2e'
import { testRunClassic } from '../utils'

function testRun(...args: Parameters<typeof testRunClassic>) {
  test('`vike/fetch` deprecation warning', async () => {
    await fetchHtml('/')
    expectLog("import vike from 'vike/fetch' is deprecated, see https://vike.dev/migration/vike-fetch")
  })
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

  test("`vike.fetch()` doesn't write a +middleware's context into the context it's given", async () => {
    const url = `${getServerUrl()}/shared-context`
    expect(await (await fetch(url, { headers: { 'x-user': 'alice' } })).text()).toBe('Hello from +middleware for alice')
    expect(await (await fetch(url)).text()).toBe('Hello from +middleware')
  })

  test("A +middleware handler runs after the app's own routes", async () => {
    expect(await fetchHtml('/from-middleware')).toBe('Hello from +middleware')
  })
}
