import { page, test, expect, run, autoRetry, fetchHtml, getServerUrl, expectLog } from '@brillout/test-e2e'

testRun()

function testRun() {
  run('pnpm run dev')

  test('Both envs are set', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Welcome</h1>')
    expect(html).toContain('<li>PUBLIC_ENV__SOME_ENV: <!-- -->123</li><li>SOME_OTHER_ENV: <!-- -->456</li>')
  })

  test('Warning is shown while client-side works', async () => {
    await page.goto(getServerUrl() + '/')
    await page.click('a[href="/"]')
    expect(await page.textContent('h1')).toBe('Welcome')
    expect(await page.textContent('button')).toBe('Counter 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toBe('Counter 1')
    })
    expectLog(
      'import.meta.env.SOME_OTHER_ENV used in /pages/index/+Page.jsx and therefore included in client-side bundle which can be be a security leak (vite-plugin-ssr will prevent your app from building for production), remove import.meta.env.SOME_OTHER_ENV or rename SOME_OTHER_ENV to PUBLIC_ENV__SOME_OTHER_ENV, see https://vite-plugin-ssr.com/env',
      (log) => log.logSource === 'stderr'
    )
  })
}
