export { testRun }

import { page, test, expect, run, fetchHtml, getServerUrl } from '@brillout/test-e2e'

const text = 'Choose between stable and cutting-edge extensions'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  run(cmd, {
    additionalTimeout: cmd === 'pnpm run dev' ? undefined : 120 * 1000
  })

  test('HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain(text)
  })

  test('DOM', async () => {
    await page.goto(getServerUrl() + '/')
    await page.waitForFunction(() => !!(window as any)._vike.fullyRenderedUrl)
    expect(await page.textContent('body')).toContain(text)
  })
}
