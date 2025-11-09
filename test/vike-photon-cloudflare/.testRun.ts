export { testRun }

import { autoRetry, expect, fetch, fetchHtml, getServerUrl, page, run, test } from '@brillout/test-e2e'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  run(cmd, {
    serverUrl: 'http://localhost:3000',
    tolerateError({ logText }) {
      return logText.includes("Vite's CLI is deprecated") || logText.includes('Run the built server entry')
    },
  })

  test('HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('Rendered to HTML.')
  })

  test('DOM', async () => {
    await page.goto(`${getServerUrl()}/`)

    await testCounter()
  })

  test('Static files', async () => {
    const response: Response = await fetch(`${getServerUrl()}/vike.svg`)

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('image/svg+xml')
  })
}

async function testCounter() {
  // autoRetry() for awaiting client-side code loading & executing
  await autoRetry(
    async () => {
      expect(await page.textContent('button')).toBe('Counter 0')
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    },
    { timeout: 5 * 1000 },
  )
}
