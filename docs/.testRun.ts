export { testRun }

import { page, test, expect, run, fetchHtml, getServerUrl, partRegex } from '@brillout/test-e2e'

const textDOM = 'Next GenerationFrontend Framework'
const textHTML = partRegex`<h1 ${/[^\>]+/}>Next Generation<br/>Frontend Framework</h1>`

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  {
    // Preview => `npm run preview` takes a long time
    // Dev => `Learn more collapsible` takes a long time
    const additionalTimeout = 120 * 1000
    run(cmd, { additionalTimeout })
  }

  test('HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toMatch(textHTML)
  })

  test('DOM', async () => {
    await page.goto(getServerUrl() + '/')
    await page.waitForFunction(() => (window as any).__docpress_hydrationFinished)
    expect(await page.textContent('h1')).toBe(textDOM)
  })
}
