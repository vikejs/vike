export { testStreamedValues }

import { autoRetry, expect, expectLog, fetch, getServerUrl, page, sleep, test } from '@brillout/test-e2e'
import { testCounter } from '../../../utils'

function testStreamedValues() {
  test('streamed pageContext values: first render, in escaped <script> tags with the CSP nonce', async () => {
    const response = await fetch(getServerUrl() + '/streamed-values')
    const nonce = /'nonce-([^']+)'/.exec(response.headers.get('content-security-policy')!)![1]
    const html = await response.text()
    const scripts = html.match(/<script[^>]*>\(self\.__vike_streamed=/g)!
    expect(scripts.length > 0).toBe(true)
    scripts.forEach((script) => expect(script).toBe(`<script nonce="${nonce}">(self.__vike_streamed=`))
    expect(html).not.toContain('<b id="unescaped">')

    await page.goto(getServerUrl() + '/streamed-values')
    await expectValues()
  })

  test('streamed pageContext values: client-side navigation, one request', async () => {
    await page.goto(getServerUrl() + '/streamed-values')
    await expectValues()
    await page.click('a[href="/"]')
    await autoRetry(async () => expect(await page.textContent('h1')).toBe('Welcome'))
    const requests: string[] = []
    const onRequest = (request: { url(): string }) => requests.push(request.url())
    page.on('request', onRequest)
    await page.goBack()
    await expectValues({ isNavigation: true })
    page.removeListener('request', onRequest)
    expect(requests.filter((url) => url.includes('.pageContext.json')).join()).toBe(
      getServerUrl() + '/streamed-values/index.pageContext.json',
    )
  })

  test('streamed pageContext values: the page keeps its values until the next page is rendered', async () => {
    await page.goto(getServerUrl() + '/streamed-values')
    await expectValues()
    await page.click('a[href="/"]')
    await autoRetry(async () => expect(await page.textContent('h1')).toBe('Welcome'))
    await page.click('a[href="/streamed-values"]')
    await autoRetry(async () => expect(await page.textContent('#generator')).toBe('first'))
    const slowNextPage = getServerUrl() + '/index.pageContext.json'
    await page.route(slowNextPage, async (route) => {
      await sleep(1000)
      await route.continue()
    })
    await page.click('a[href="/"]')
    await sleep(300)
    expect(await page.textContent('#generator')).toMatch(/^first/)
    await autoRetry(async () => expect(await page.textContent('h1')).toBe('Welcome'))
    await page.unroute(slowNextPage)
    expectLog('Streamed value failed on purpose', { filter: (log) => log.logSource === 'stderr' })
  })

  test('streamed pageContext values: the decoder is loaded only by pages with streamed values', async () => {
    let isDecoderLoaded = false
    const onResponse = async (response: { text(): Promise<string> }) => {
      const body = await response.text().catch(() => '')
      if (body.includes('The pageContext.json response ended before the streamed pageContext values ended')) {
        isDecoderLoaded = true
      }
    }
    page.on('response', onResponse)
    await page.goto(getServerUrl() + '/')
    await testCounter()
    await page.click('a[href="/about"]')
    await autoRetry(async () => expect(await page.textContent('h1')).toBe('About'))
    await sleep(500)
    expect(isDecoderLoaded).toBe(false)
    await page.click('a[href="/streamed-values"]')
    await expectValues({ isNavigation: true })
    await autoRetry(async () => expect(isDecoderLoaded).toBe(true))
    page.removeListener('response', onResponse)
  })
}

async function expectValues({ isNavigation = false } = {}) {
  // The first chunk arrives before the last one is produced
  if (isNavigation) await autoRetry(async () => expect(await page.textContent('#generator')).toBe('first'))
  await autoRetry(
    async () => {
      expect(await page.textContent('#promise')).toBe('</script><b id="unescaped">unescaped</b><!--')
      expect(await page.textContent('#bytes')).toBe(
        Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0')).join(''),
      )
      expect(await page.textContent('#failing')).toBe(
        'A streamed pageContext value failed on the server-side (see the server logs)',
      )
      expect(await page.textContent('#generator')).toBe('first,last')
    },
    { timeout: 5 * 1000 },
  )
  expect(await page.locator('#unescaped').count()).toBe(0)
  expectLog('Streamed value failed on purpose', { filter: (log) => log.logSource === 'stderr' })
}
