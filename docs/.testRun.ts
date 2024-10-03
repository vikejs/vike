export { testRun }

import { page, test, expect, run, fetchHtml, getServerUrl } from '@brillout/test-e2e'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  {
    // Preview => `npm run preview` takes a long time
    // Dev => `Learn more collapsible` takes a long time
    const additionalTimeout = 120 * 1000
    run(cmd, { additionalTimeout })
  }

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('integrate tools manually')
  })

  test('Learn more collapsible', async () => {
    await page.goto(getServerUrl() + '/')
    await page.waitForFunction(() => (window as any).__docpress_hydrationFinished)
  })
}
