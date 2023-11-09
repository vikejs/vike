export { testRun as test }

import { run, page, test, expect, getServerUrl, fetchHtml, expectLog, autoRetry } from '@brillout/test-e2e'
import { ensureWasClientSideRouted, expectPageContextJsonRequest, testCounter } from '../utils'

function testRun(cmd: 'npm run dev' | 'npm run preview') {
  run(cmd)

  const isDev = cmd === 'npm run dev'

  test('HTML', async () => {
    const t = async (url: string, v1: string, v2: string, v3: string) => {
      const html = await fetchHtml(url)
      expect(html).toContain(`<p>onBeforeRender() 1 called: <!-- -->${v1}</p>`)
      expect(html).toContain(`<p>onBeforeRender() 2 called: <!-- -->${v2}</p>`)
      expect(html).toContain(`<p>onBeforeRender() env: <!-- -->${v3}</p>`)
    }
    await t('/', 'true', 'undefined', 'server')
    await t('/page-3', 'undefined', 'undefined', 'undefined')
    await t('/page-4', 'undefined', 'undefined', 'undefined')
  })

  test('wrong hook suppressing usage', async () => {
    await fetchHtml('/page-2')
    await autoRetry(() => {
      expectLog(
        '[Wrong Usage] Set onBeforeRender to null in a +config.h.js file instead of /pages/page-2/+onBeforeRender.tsx',
        (log) => log.logSource === 'stderr'
      )
    })
    await autoRetry(() => {
      expectLog('HTTP response', (log) => log.logSource === 'stderr')
    })
    if (isDev) {
      expectLog('No error page found', (log) => log.logSource === 'stderr')
    }
  })

  test('Request pageContext JSON only if necessary', async () => {
    await page.goto(getServerUrl() + '/')
    await testCounter()
    {
      const done = expectPageContextJsonRequest(false)
      await page.click('a[href="/page-4"]')
      await testCounter(1)
      await ensureWasClientSideRouted('/pages/index')
      done()
    }
    {
      const done = expectPageContextJsonRequest(false)
      await page.click('a[href="/page-3"]')
      await testCounter(2)
      await ensureWasClientSideRouted('/pages/index')
      done()
    }
    {
      const done = expectPageContextJsonRequest(true)
      await page.click('a[href="/"]')
      await testCounter(3)
      await ensureWasClientSideRouted('/pages/index')
      done()
    }
  })

  test('client-only onBeforeRender()', async () => {
    expect(await page.textContent('body')).toContain('onBeforeRender() 1 called: true')
    expect(await page.textContent('body')).toContain('onBeforeRender() 2 called: undefined')
    expect(await page.textContent('body')).toContain('onBeforeRender() env: server')
    {
      const done = expectPageContextJsonRequest(false)
      await page.click('a[href="/page-4"]')
      await testCounter(4)
      ensureWasClientSideRouted('/pages/index')
      done()
    }
    expect(await page.textContent('body')).toContain('onBeforeRender() 1 called: undefined')
    expect(await page.textContent('body')).toContain('onBeforeRender() 2 called: 42')
    expect(await page.textContent('body')).toContain('onBeforeRender() env: client')
  })
}
