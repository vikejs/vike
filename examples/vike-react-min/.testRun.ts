export { testRun }

import { page, test, expect, run, fetchHtml, getServerUrl } from '@brillout/test-e2e'
import { testCounter } from '../../test/utils'

function testRun(cmd: 'npm run dev' | 'npm run preview') {
  run(cmd)

  test('HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Vike React app</h1>')
  })

  test('interactive', async () => {
    await page.goto(getServerUrl() + '/')
    await testCounter()
  })
}
