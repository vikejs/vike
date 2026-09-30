export { testRun as test }

import { run, page, test, expect, getServerUrl, autoRetry, expectLog, fetch } from '@brillout/test-e2e'

declare global {
  var __renderCount: number
  var __chunks: { key: string; chunk: any; receivedAt: number }[]
  var __xss: undefined | true
}

const hex = (bytes: Iterable<number>) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
const errorMessage = 'error:A streamed pageContext value failed on the server-side (see the server logs)'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  run(cmd)
  const isPreview = cmd === 'pnpm run preview'

  test('first render: the values stream after the HTML, in escaped <script> tags with the CSP nonce', async () => {
    const response = await fetch(getServerUrl() + '/streamed')
    const nonce = /'nonce-([^']+)'/.exec(response.headers.get('content-security-policy')!)![1]
    const html = await response.text()
    const scripts = html.match(/<script[^>]*>\(self\.__vike_streamed=/g)!
    expect(scripts.length > 10).toBe(true)
    scripts.forEach((script) => expect(script).toBe(`<script nonce="${nonce}">(self.__vike_streamed=`))
    // `</script>` in a value doesn't break out of the <script> tag
    expect(html).not.toContain('<script>window.__xss')
    expect(html).toContain('\\\\u003c\\/script>\\\\u003cscript>window.__xss')

    await page.goto(getServerUrl() + '/streamed')
    await expectStreamedPage(1)
    expect(await page.evaluate(() => window.__xss)).toBe(undefined)
    expectLog('Stream failed on purpose', { filter: (log) => log.logSource === 'stderr' })
  })

  test('client-side navigation: one request, the values stream', async () => {
    await page.goto(getServerUrl() + '/')
    await autoRetry(async () => expect(await page.textContent('#home')).toBe('home data'))
    const getRequests = trackRequests()
    await page.click('a[href="/streamed"]')
    await expectStreamedPage(2)
    expect(getRequests().join()).toBe('/streamed/index.pageContext.json')
    expectLog('Stream failed on purpose', { filter: (log) => log.logSource === 'stderr' })
  })

  test('back navigation: one request, the values stream', async () => {
    await page.goto(getServerUrl() + '/streamed')
    await expectStreamedPage(1)
    await page.click('a[href="/"]')
    await autoRetry(async () => expect(await page.textContent('#home')).toBe('home data'))
    const getRequests = trackRequests()
    await page.goBack()
    await expectStreamedPage(3)
    expect(getRequests().join()).toBe('/streamed/index.pageContext.json')
    expectLog('Stream failed on purpose', { filter: (log) => log.logSource === 'stderr' })
  })

  test('pre-rendered page (HTML string): first render and client-side navigation', async () => {
    await page.goto(getServerUrl() + '/prerendered')
    const valuesFirstRender = await getPrerenderedValues(1)
    await page.click('a[href="/"]')
    await autoRetry(async () => expect(await page.textContent('#home')).toBe('home data'))
    const getRequests = trackRequests()
    await page.click('a[href="/prerendered"]')
    const valuesNavigation = await getPrerenderedValues(3)
    expect(getRequests().join()).toBe('/prerendered/index.pageContext.json')
    // Pre-rendered: the page was rendered once, the HTML and index.pageContext.json have the same values
    expect(JSON.stringify(valuesNavigation) === JSON.stringify(valuesFirstRender)).toBe(isPreview)
  })

  test('a navigation superseded before its page is rendered cancels its values on the server', async () => {
    const getCancelCount = async () =>
      (await (await fetch(getServerUrl() + '/status/index.pageContext.json')).json()).data.cancelCount
    const cancelCount = await getCancelCount()
    await page.goto(getServerUrl() + '/')
    await autoRetry(async () => expect(await page.textContent('#home')).toBe('home data'))
    const request = page.waitForRequest((request) => request.url().endsWith('/cancel/index.pageContext.json'))
    await page.click('a[href="/cancel"]')
    await request
    // Supersedes the navigation to /cancel while its +onData.client.ts hook is pending
    await page.click('a[href="/streamed"]')
    // Cancelled right away, not after the hook
    await autoRetry(async () => expect(await getCancelCount()).toBe(cancelCount + 1), { timeout: 2000 })
    await expectStreamedPage(2)
    expectLog('Stream failed on purpose', { filter: (log) => log.logSource === 'stderr' })
  })

  if (!isPreview) {
    test("without streamed values, the client doesn't load the streamed values decoder", async () => {
      const requests: string[] = []
      const listener = (request: { url(): string }) => requests.push(request.url())
      page.on('request', listener)
      await page.goto(getServerUrl() + '/')
      await autoRetry(async () => expect(await page.textContent('#home')).toBe('home data'))
      expect(await page.textContent('#lookalikes')).toBe(
        'quote="!VikeStream:0"!VikePromise:0=keystring=!VikeAsyncIterable:0',
      )
      page.removeListener('request', listener)
      expect(requests.some((url) => url.includes('streamedValues'))).toBe(false)
    })
  }

  if (isPreview) {
    test('pre-rendered index.pageContext.json: valid JSON, with the values of the HTML', async () => {
      const json = await (await fetch(getServerUrl() + '/prerendered/index.pageContext.json')).text()
      const pageContext = JSON.parse(json)
      expect(pageContext.data.promise).toBe('!VikePromise:0')
      expect(JSON.stringify(pageContext._streamedValues.at(-1))).toBe('{"s":1,"end":true}')
      const html = await (await fetch(getServerUrl() + '/prerendered')).text()
      expect(html).toContain(pageContext.data.random)
      pageContext._streamedValues.forEach((line: unknown) => {
        const script = `.push(${JSON.stringify(JSON.stringify(line)).replaceAll('<', '\\u003c').replaceAll('/', '\\/')})`
        expect(html).toContain(script)
      })
    })
  }
}

// `renderCount`: the number of onRenderClient() calls since the page was loaded
async function expectStreamedPage(renderCount: number) {
  await autoRetry(
    async () => {
      expect(await page.evaluate(() => window.__renderCount)).toBe(renderCount)
      expect(await page.locator('li:not([data-done])').count()).toBe(0)
      expect(await page.locator('li').count()).toBe(7)
    },
    { timeout: 10 * 1000 },
  )
  const text = async (id: string) => await page.textContent(`#${id}`)
  expect(await text('plain')).toBe('plain value')
  expect(await text('slow')).toBe('slow value')
  expect(await text('generator')).toMatch(/^label=firstproducedAt=\d+label=lastproducedAt=\d+$/)
  expect(await text('bytes')).toBe(
    `bytes:${hex(Array.from({ length: 256 }, (_, i) => i))}bytes:${hex(Buffer.from('héllo'))}`,
  )
  // Failing mid-way affects only that value: the chunk before the error arrives
  expect(await text('failing')).toBe(`before error${errorMessage}`)
  expect(await text('xss')).toBe('</script><script>window.__xss = true</script><!--')
  expect(await text('nested')).toBe('inner=deepdeeper')
  // The first chunk arrives before the last one is produced
  const chunks = await page.evaluate(() => window.__chunks.filter((c) => c.key === 'generator'))
  expect(chunks.map((c) => c.chunk.label).join()).toBe('first,last')
  expect(chunks[0]!.receivedAt < chunks[1]!.chunk.producedAt).toBe(true)
}

async function getPrerenderedValues(renderCount: number) {
  await autoRetry(
    async () => {
      expect(await page.evaluate(() => window.__renderCount)).toBe(renderCount)
      expect(await page.textContent('h1')).toBe('Pre-rendered')
      expect(await page.locator('li:not([data-done])').count()).toBe(0)
      expect(await page.locator('li').count()).toBe(3)
    },
    { timeout: 10 * 1000 },
  )
  const values = await page.evaluate(() => ({
    random: document.getElementById('random')!.textContent,
    promise: document.getElementById('promise')!.textContent,
    generator: document.getElementById('generator')!.textContent,
  }))
  expect(values.promise).toMatch(/^random=0\.\d+$/)
  expect(values.generator).toMatch(new RegExp(`^0\\.\\d+bytes:${hex(Array.from({ length: 256 }, (_, i) => i))}$`))
  return values
}

// The requests made by the page, apart from assets
function trackRequests() {
  const requests: string[] = []
  const listener = (request: { url(): string; resourceType(): string }) => {
    const url = new URL(request.url())
    if (request.resourceType() === 'document' || url.pathname.endsWith('.pageContext.json')) requests.push(url.pathname)
  }
  page.on('request', listener)
  return () => {
    page.removeListener('request', listener)
    return requests
  }
}
