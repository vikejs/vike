export { testRun }

import { fetchHtml, page, test, expect, run, getServerUrl } from '@brillout/test-e2e'
import { testCounter } from '../../test/utils'

function testRun(cmd: 'npm run dev' | 'npm run prod') {
  run(cmd, {
    // The GraphQL API is flaky
    isFlaky: true
  })

  test('page is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<li>Angola</li><li>Antarctica</li><li>Argentina</li><li>American Samoa</li>')
    expect(html).toContain('<button>Counter <span>0</span></button>')
  })

  test('page is hydrated to DOM', async () => {
    page.goto(`${getServerUrl()}/`)
    await testCounter()
    expect(await page.textContent('body')).toContain('Antarctica')
  })
}
