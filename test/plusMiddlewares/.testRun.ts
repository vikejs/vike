export { testRun }

import { autoRetry, expect, expectLog, fetch, fetchHtml, getServerUrl, page, run, test } from '@brillout/test-e2e'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  run(cmd, {
    serverUrl: 'http://localhost:3000',
    tolerateError({ logText }) {
      return (
        logText.includes("Vite's CLI is deprecated") ||
        logText.includes('Run the built server entry') ||
        // The browser logs the 404 of the guarded page's .pageContext.json, then the 401 of the page
        logText.includes('the server responded with a status of 404') ||
        logText.includes('the server responded with a status of 401') ||
        // The +middleware whose response handler throws
        logText.includes('response handler failed')
      )
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

  test('The context a +middleware returns reaches pageContext', async () => {
    expect(await fetchHtml('/')).toContain('data-from-mw="yes"')
  })

  test('+middleware with a path that passes the request on falls through to the page', async () => {
    for (const url of ['/', '/index.pageContext.json']) {
      expect((await fetch(`${getServerUrl()}${url}`)).status).toBe(200)
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

  test('Every +middleware whose path matches runs, then the page', async () => {
    // Both adminAuth (/admin/**) and settingsHeader (/admin/settings) match
    expect((await fetch(`${getServerUrl()}/admin/settings`)).status).toBe(401)
    const response: Response = await fetch(`${getServerUrl()}/admin/settings`, { headers: { 'x-auth': '1' } })
    expect(response.status).toBe(200)
    expect(response.headers.get('x-settings')).toBe('yes')
    expect(await response.text()).toContain('Admin settings')
  })

  test("A +middleware with a path also guards the page's .pageContext.json (client-side navigation)", async () => {
    expect((await fetch(`${getServerUrl()}/dash`)).status).toBe(401)
    const url = `${getServerUrl()}/dash/index.pageContext.json`
    const response: Response = await fetch(url)
    expect(response.status).toBe(404)
    expect(await response.text()).toBe('Unauthorized')
    const responseAuth: Response = await fetch(url, { headers: { 'x-auth': '1' } })
    expect(responseAuth.status).toBe(200)
    expect(await responseAuth.text()).toContain('DASH-SECRET')
    // `%2564ash` is the literal text `%64ash`, not `dash`: like that page, its .pageContext.json is a 404
    const responseEncoded: Response = await fetch(`${getServerUrl()}/%2564ash/index.pageContext.json`)
    expect(await responseEncoded.text()).toContain('"is404":true')
  })

  test("A +middleware's own response to a .pageContext.json request is answered as a 404", async () => {
    const response: Response = await fetch(`${getServerUrl()}/admin/settings/index.pageContext.json`)
    expect(response.status).toBe(404)
    expect(await response.text()).toBe('Unauthorized')
  })

  test("A +middleware's own response to a client-side navigation is shown", async () => {
    for (const pathname of ['/admin/data', '/dash']) {
      await page.goto(`${getServerUrl()}/`)
      await testCounter()
      await page.click(`a[href="${pathname}"]`)
      await autoRetry(async () => {
        expect(await page.textContent('body')).toBe('Unauthorized')
      })
    }
  })

  test("A +middleware's redirect of a client-side navigation is followed", async () => {
    await page.goto(`${getServerUrl()}/`)
    await testCounter()
    await page.click('a[href="/guarded"]')
    await autoRetry(async () => {
      expect(page.url()).toBe(`${getServerUrl()}/login`)
      expect(await page.textContent('body')).toContain('Login')
    })
  })

  test("A +middleware's login page, answered with status 200 to a client-side navigation, is shown", async () => {
    await page.goto(`${getServerUrl()}/`)
    await testCounter()
    await page.click('a[href="/portal"]')
    await autoRetry(async () => {
      expect(await page.textContent('body')).toBe('Log in to continue')
    })
  })

  test("A +middleware's response function can decorate or replace the response to a .pageContext.json request", async () => {
    const url = `${getServerUrl()}/wrapped/index.pageContext.json`
    const decorated: Response = await fetch(url)
    expect(decorated.status).toBe(200)
    expect(decorated.headers.get('x-wrapped')).toBe('yes')
    expect(await decorated.text()).toContain('WRAPPED-DATA')
    const replaced: Response = await fetch(url, { headers: { 'x-replace': '1' } })
    expect(replaced.status).toBe(404)
    expect(await replaced.text()).toBe('Replaced')
  })

  test('A +middleware response handler that throws fails that request only', async () => {
    const response: Response = await fetch(`${getServerUrl()}/?throwing-response-handler`, {
      signal: AbortSignal.timeout(10 * 1000),
    })
    expect(response.status).not.toBe(200)
    expect((await fetch(`${getServerUrl()}/`)).status).toBe(200)
  })

  test('The request numbers in the logs are consecutive', async () => {
    const ids: number[] = []
    for (const [index, query] of ['a', 'b', 'c'].entries()) {
      await fetch(`${getServerUrl()}/?request-number-${query}`)
      await autoRetry(() => {
        expectLog(new RegExp(`\\[request-\\d+\\] HTTP request .*\\?request-number-${query}`), {
          filter: ({ logText }) => {
            ids[index] = Number(/\[request-(\d+)\]/.exec(logText)![1])
            return true
          },
        })
      })
    }
    expect(ids.map((id) => id - ids[0]!)).to.deep.equal([0, 1, 2])
  })

  test('A +middleware with a path and order 0 still answers its path, and the pages still render', async () => {
    expect(await (await fetch(`${getServerUrl()}/order-zero`)).text()).toBe('order zero')
    expect(await fetchHtml('/')).toContain('Rendered to HTML.')
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
