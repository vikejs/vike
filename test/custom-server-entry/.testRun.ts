export { testRun }

import { test, expect, fetch, fetchHtml, getServerUrl } from '@brillout/test-e2e'
import { testRunClassic } from '../utils'

function testRun(...args: Parameters<typeof testRunClassic>) {
  testRunClassic(...args)

  test('+server.ts route', async () => {
    expect(await fetchHtml('/hello')).toBe('Hello from +server.ts')
  })

  test("`vike.fetch()` renders the page for a method the pages don't list (PROPFIND)", async () => {
    const response: Response = await fetch(`${getServerUrl()}/`, { method: 'PROPFIND' })
    expect(response.status).toBe(200)
    expect(await response.text()).toContain('<html')
  })
}
