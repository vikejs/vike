export { testRun as test }

import { run, page, test, expect, getServerUrl, fetchHtml, autoRetry, expectLog, partRegex } from '@brillout/test-e2e'
import { ensureWasClientSideRouted, expectUrl, hydrationDone, testCounter } from '../utils'

function testRun(cmd: string, pageContextInitHasClientData?: true) {
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

  test('rewrite - client-side (with Client Routing)', async () => {
    await page.goto(getServerUrl() + '/about')
    expect(await page.textContent('h1')).toBe('About')
    await hydrationDone()
    const done = expectPageContextJsonRequest()
    await page.click('a[href="/render-homepage"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('Welcome')
    })
    await testCounter()
    done()
    await ensureWasClientSideRouted('/pages/about')
  })

  test('redirect - server-side', async () => {
    await page.goto(getServerUrl() + '/redirect')
    expectUrl('/')
  })

  test('redirect - client-side (with Client Routing)', async () => {
    await page.goto(getServerUrl() + '/about')
    expectUrl('/about')
    await hydrationDone()
    const done = expectPageContextJsonRequest()
    await page.click('a[href="/redirect"]')
    await autoRetry(async () => {
      expectUrl('/')
    })
    await testCounter()
    done()
    await ensureWasClientSideRouted('/pages/about')
  })

  {
    const url = getServerUrl() + '/show-error-page'
    const expectErrServer = () => expectLog('HTTP response /show-error-page 503', (log) => log.logSource === 'stderr')
    const expectErrClient = () =>
      expectLog(
        'Failed to load resource: the server responded with a status of 503 (Service Unavailable)',
        (log) =>
          log.logSource === 'Browser Error' && partRegex`http://${/[^\/]+/}:3000/show-error-page`.test(log.logText)
      )
    test('render error page - HTML', async () => {
      const response = await fetch(url)
      expectErrServer()
      expect(response.status).toBe(503)
      const html = await response.text()
      expect(html).toContain('Testing throw render error page.')
      expect(html).toContain('<p style="font-size:1.3em">Testing throw render error page.</p>')
      expect(html).toContain('"abortReason":"Testing throw render error page."')
    })

    test('render error page - server-side routing', async () => {
      await page.goto(url)
      expectErrServer()
      expectErrClient()
      await testCounter()
      expectUrl('/show-error-page')
    })

    test('render error page - client-side routing', async () => {
      await page.goto(getServerUrl() + '/about')
      expectUrl('/about')
      await hydrationDone()
      const done = expectPageContextJsonRequest()
      await page.click('a[href="/show-error-page"]')
      await testCounter()
      done()
      expect(await page.textContent('p')).toBe('Testing throw render error page.')
      expectUrl('/show-error-page')
      await ensureWasClientSideRouted('/pages/about')
    })
  }

  return

  function expectPageContextJsonRequest() {
    const reqs: string[] = []
    const listener = (request: any) => reqs.push(request.url())
    page.on('request', listener)
    return () => {
      page.removeListener('request', listener)
      const count = reqs.filter((url) => url.endsWith('.pageContext.json')).length
      const exists = count > 0
      if (pageContextInitHasClientData) {
        expect(exists).toBe(true)
      } else {
        expect(exists).toBe(false)
      }
    }
  }
}
