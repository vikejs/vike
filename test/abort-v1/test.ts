import { run, page, test, expect, getServerUrl, fetchHtml, autoRetry, partRegex } from '@brillout/test-e2e'

export { testRun as test }

function testRun(cmd: 'npm run dev' | 'npm run preview') {
  run(cmd)

  test('HTML', async () => {
    const t = async (url: string) => {
      const html = await fetchHtml(url)
      expect(html).toContain('<h1>Welcome</h1>')
    }
    await t('/')
    await t('/render-homepage')
    await t('/redirect')
  })

  test('DOM', async () => {
    const t = async (url: string) => {
      await page.goto(getServerUrl() + url)
      expect(await page.textContent('h1')).toBe('Welcome')
      await testCounter()
    }
    await t('/')
    await t('/render-homepage')
    await t('/redirect')
  })

  test('Rewrite - Client Routing', async () => {
    await page.goto(getServerUrl() + '/about')
    expect(await page.textContent('h1')).toBe('About')
    await hydrationDone()

    await page.click('a[href="/render-homepage"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('Welcome')
    })
    await testCounter()

    // Ensure page wasn't server-side routed
    {
      const html = await page.content()
      const pageId = findFirstPageId(html)
      expect(pageId).toBe('/pages/about')
    }
  })

  test('redirect - server-side', async () => {
    // Server-side redirection
    await page.goto(getServerUrl() + '/redirect')
    expectUrl('/')
  })

  test('redirect - client-side (with Client Routing)', async () => {
    await page.goto(getServerUrl() + '/about')
    expectUrl('/about')
    await hydrationDone()

    await page.click('a[href="/redirect"]')
    await autoRetry(async () => {
      expectUrl('/')
    })

    // Ensure page wasn't server-side routed
    {
      const html = await page.content()
      const pageId = findFirstPageId(html)
      expect(pageId).toBe('/pages/about')
    }
  })
}

function expectUrl(pathname: string) {
  expect(page.url()).toBe(getServerUrl() + pathname)
}

async function hydrationDone() {
  await testCounter()
}

async function testCounter() {
  expect(await page.textContent('button')).toBe('Counter 0')
  // autoRetry() because browser-side code may not be loaded yet
  await autoRetry(async () => {
    await page.click('button')
    expect(await page.textContent('button')).toContain('Counter 1')
  })
}

function findFirstPageId(html: string) {
  expect(html).toContain('<script id="vite-plugin-ssr_pageContext" type="application/json">')
  expect(html).toContain('_pageId')
  expect(html.split('_pageId').length).toBe(2)
  const match = partRegex`"_pageId":"${/([^"]+)/}"`.exec(html)
  expect(match).toBeTruthy()
  const pageId = match![1]
  expect(pageId).toBeTruthy()
  return pageId
}
