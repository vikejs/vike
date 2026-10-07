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

  test('Middlewares', async () => {
    const response: Response = await fetch(`${getServerUrl()}/middleware`)

    expect(response.status).toBe(200)
    expect(await response.text()).toBe('OK')
  })

  test('Middleware returning a redirect (3xx) Response', async () => {
    const response: Response = await fetch(`${getServerUrl()}/redirect-middleware`, { redirect: 'manual' })

    expect(response.status).toBe(303)
    expect(response.headers.get('Location')).toBe('/')
  })

  test('Middlewares run once, also when a middleware calls renderPage()', async () => {
    for (const url of ['/', '/render-page-middleware']) {
      const response: Response = await fetch(`${getServerUrl()}${url}`)
      expect(await response.text()).toContain('Rendered to HTML.')
      expect(response.headers.get('x-middleware')).toBe('express')
    }
  })

  test('+middleware with a path that passes the request on falls through to the page', async () => {
    for (const url of ['/', '/index.pageContext.json']) {
      expect((await fetch(`${getServerUrl()}${url}`)).status).toBe(200)
    }
  })

  test('+middleware with a path also guards its .pageContext.json', async () => {
    for (const url of ['/dash', '/dash/index.pageContext.json']) {
      expect((await fetch(`${getServerUrl()}${url}`)).status).toBe(401)
      const response: Response = await fetch(`${getServerUrl()}${url}`, { headers: { 'x-authenticated': '' } })
      expect(response.status).toBe(200)
    }
  })

  test('+middleware with a GET path also guards HEAD', async () => {
    expect((await fetch(`${getServerUrl()}/dash`, { method: 'HEAD' })).status).toBe(401)
  })

  test("+middleware response handlers apply to Vike's own redirects", async () => {
    // Trailing slash removal
    const response: Response = await fetch(`${getServerUrl()}/some-page/`, { redirect: 'manual' })
    expect(response.status).toBe(301)
    expect(response.headers.get('x-middleware')).toBe('express')
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
