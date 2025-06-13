export {testRun as test }

import { run, page, test, expect, getServerUrl, fetchHtml, autoRetry, expectLog, partRegex } from '@brillout/test-e2e'
import { ensureWasClientSideRouted, expectUrl, testCounter, expectPageContextJsonRequest } from '../utils'

function testRun(
  cmd: 'npm run dev:server' | 'npm run dev' | 'npm run preview' | 'npm run prod',
  pageContextInitIsPassedToClient = false,
) {
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
    const done = expectPageContextJsonRequest(pageContextInitIsPassedToClient)
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
    await expectUrl('/')
  })

  test('redirect - client-side (with Client Routing)', async () => {
    await page.goto(getServerUrl() + '/about')
    await expectUrl('/about')
    await hydrationDone()
    const done = expectPageContextJsonRequest(pageContextInitIsPassedToClient)
    await page.click('a[href="/redirect"]')
    await expectUrl('/')
    await testCounter()
    done()
    await ensureWasClientSideRouted('/pages/about')
  })

  {
    const url = getServerUrl() + '/show-error-page'
    const expectErrServer = () => {
      // Maybe we should also show a log in production?
      if (cmd === 'npm run prod') return
      expectLog('HTTP response /show-error-page 503', { filter: (log) => log.logSource === 'stderr' })
    }
    const expectErrClient = () =>
      expectLog('Failed to load resource: the server responded with a status of 503 (Service Unavailable)', {
        filter: (log) =>
          log.logSource === 'Browser Error' && partRegex`http://${/[^\/]+/}:3000/show-error-page`.test(log.logInfo),
      })
    test('render error page - HTML', async () => {
      const response = await fetch(url)
      expect(response.status).toBe(503)
      expectErrServer()
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
      await expectUrl('/show-error-page')
    })

    test('render error page - client-side routing', async () => {
      await page.goto(getServerUrl() + '/about')
      await expectUrl('/about')
      await hydrationDone()
      const done = expectPageContextJsonRequest(pageContextInitIsPassedToClient)
      await page.click('a[href="/show-error-page"]')
      await testCounter()
      done()
      expect(await page.textContent('p')).toBe('Testing throw render error page.')
      await expectUrl('/show-error-page')
      await ensureWasClientSideRouted('/pages/about')
    })
  }

  test('permanent redirect', async () => {
    const url = getServerUrl() + '/permanent-redirect'
    // server-side
    const resp = await fetch(url, { redirect: 'manual' })
    expect(resp.status).toBe(301)
    // client-side
    await page.click('a[href="/permanent-redirect"]')
    await expectUrl('/')
  })

  test('external redirect - client-side', async () => {
    await page.goto(getServerUrl() + '/')
    await hydrationDone()
    await page.click('a[href="/redirect-external"]')
    await page.waitForURL('https://brillout.github.io/star-wars/')
  })
  test('external redirect - server-side', async () => {
    await page.goto(getServerUrl() + '/redirect-external')
    await page.waitForURL('https://brillout.github.io/star-wars/')
  })

  test('permanent external redirect', async () => {
    const url = getServerUrl() + '/permanent-redirect'
    // server-side
    const resp = await fetch(url, { redirect: 'manual' })
    expect(resp.status).toBe(301)
    // client-side
    await page.goto(getServerUrl() + '/')
    await hydrationDone()
    await page.click('a[href="/star-wars-api/films/1.json"]')
    await page.waitForURL('https://brillout.github.io/star-wars/api/films/1.json')
  })
}

async function hydrationDone() {
  await testCounter()
}
