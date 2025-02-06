export { testRun }

import { page, test, expect, run, autoRetry, fetchHtml, getServerUrl, expectLog } from '@brillout/test-e2e'

function testRun(
  cmd: 'npm run dev' | 'npm run preview' | 'npm run prod',
  { isCJS, skipAboutPage }: { isCJS?: true; skipAboutPage?: true } = {}
) {
  run(cmd)

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Welcome</h1>')
    if (isCJS) {
      expectLog('package.json#type to "module", see https://vike.dev/CJS', {
        filter: (log) => log.logSource === 'stderr'
      })
    }
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(getServerUrl() + '/')
    await page.click('a[href="/"]')
    expect(await page.textContent('h1')).toBe('Welcome')
    expect(await page.textContent('button')).toBe('Counter 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toBe('Counter 1')
    })
  })

  if (!skipAboutPage) {
    test('about page', async () => {
      await page.click('a[href="/about"]')
      await autoRetry(async () => {
        expect(await page.textContent('h1')).toBe('About')
      })
      expect(await page.textContent('p')).toBe('Example of using Vike.')
      const html = await fetchHtml('/about')
      expect(html).toContain('<h1>About</h1>')
    })
  }
}
