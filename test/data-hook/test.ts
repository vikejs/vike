export { testRun as test }

import { run, page, test, expect, getServerUrl, fetchHtml, expectLog, autoRetry } from '@brillout/test-e2e'
import { ensureWasClientSideRouted, expectPageContextJsonRequest, testCounter } from '../utils'

function testRun(cmd: 'npm run dev' | 'npm run preview') {
  run(cmd)

  const isDev = cmd === 'npm run dev'

  test('HTML', async () => {
    const t = async (url: string, v1: string, v2: string, v3: string, v4: string, v5: string, v6: string) => {
      const html = await fetchHtml(url)
      expect(html).toContain(`<p>global data() was called: <!-- -->${v1}</p>`)
      expect(html).toContain(`<p>global data() was called in env: <!-- -->${v2}</p>`)
      expect(html).toContain(`<p>per-page data() was called: <!-- -->${v3}</p>`)
      expect(html).toContain(`<p>per-page data() was called in env: <!-- -->${v4}</p>`)
      expect(html).toContain(`<p>global onBeforeRender() was called: <!-- -->${v5}</p>`)
      expect(html).toContain(`<p>global onBeforeRender() was called in env: <!-- -->${v6}</p>`)
    }
    await t('/', 'true', 'server', 'undefined', 'undefined', 'true', 'server')
    await t('/page-2', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined')
    await t('/page-3', 'undefined', 'undefined', 'true', 'server', 'true', 'server')
    await t('/page-4', 'undefined', 'undefined', 'undefined', 'undefined', 'true', 'server')
  })

  test('Request pageContext JSON only if necessary', async () => {
    await page.goto(getServerUrl() + '/')
    await testCounter()
    {
      // because neither data() nor onBeforeRender() are server-only
      const done = expectPageContextJsonRequest(false)
      await page.click('a[href="/page-4"]')
      await testCounter(1)
      await ensureWasClientSideRouted('/pages/index')
      done()
    }
    {
      // because both data() and onBeforeRender() are server-only
      const done = expectPageContextJsonRequest(true)
      await page.click('a[href="/page-3"]')
      await testCounter(2)
      await ensureWasClientSideRouted('/pages/index')
      done()
    }
    {
      // because both data() and onBeforeRender() are server-only, even though they are both null
      const done = expectPageContextJsonRequest(true)
      await page.click('a[href="/page-2"]')
      await testCounter(3)
      await ensureWasClientSideRouted('/pages/index')
      done()
    }
    {
      // because both data() and onBeforeRender() are server-only
      const done = expectPageContextJsonRequest(true)
      await page.click('a[href="/"]')
      await testCounter(4)
      await ensureWasClientSideRouted('/pages/index')
      done()
    }
  })

  test('client-only data()', async () => {
    expect(await page.textContent('body')).toContain('global data() was called: true')
    expect(await page.textContent('body')).toContain('global data() was called in env: server')
    expect(await page.textContent('body')).toContain('per-page data() was called: undefined')
    expect(await page.textContent('body')).toContain('per-page data() was called in env: undefined')
    {
      const done = expectPageContextJsonRequest(false)
      await page.click('a[href="/page-4"]')
      await testCounter(5)
      ensureWasClientSideRouted('/pages/index')
      done()
    }
    expect(await page.textContent('body')).toContain('global data() was called: undefined')
    expect(await page.textContent('body')).toContain('global data() was called in env: undefined')
    expect(await page.textContent('body')).toContain('per-page data() was called: true')
    expect(await page.textContent('body')).toContain('per-page data() was called in env: client')
  })
}
