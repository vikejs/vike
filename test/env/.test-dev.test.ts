import { page, test, expect, run, fetchHtml, getServerUrl, expectLog } from '@brillout/test-e2e'
import { testCounter } from '../utils'

testRun()

function testRun() {
  run('pnpm run dev')

  test('Both envs are set', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Welcome</h1>')
    expect(html).toContain('<li>PUBLIC_ENV__SOME_ENV: <!-- -->123</li>')
    expect(html).toContain('<li>SOME_OTHER_ENV: <!-- -->456</li>')
    expect(html).toContain('<li>data: <!-- -->begin-abc-end</li>')
  })

  test('Warning is shown while client-side works', async () => {
    await page.goto(getServerUrl() + '/')
    await page.click('a[href="/"]')
    expect(await page.textContent('h1')).toBe('Welcome')
    await testCounter()
    expectLog(
      'import.meta.env.SOME_OTHER_ENV used in /pages/index/+Page.jsx and therefore included in client-side bundle which can be be a security leak (vike will prevent your app from building for production), remove import.meta.env.SOME_OTHER_ENV or rename SOME_OTHER_ENV to PUBLIC_ENV__SOME_OTHER_ENV, see https://vike.dev/env',
      (log) => log.logSource === 'stderr'
    )
  })
}
