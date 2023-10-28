export { testRun }

import { fetchHtml, test, expect } from '@brillout/test-e2e'
import { testRun as testRunClassic } from '../../examples/react/.testRun'

function testRun(cmd: 'npm run dev' | 'npm run preview') {
  testRunClassic(cmd)

  test('third page with overriden filesystem route', async () => {
    const html = await fetchHtml('/third-page')
    expect(html).toContain('<h1>Third page</h1>')
  })
}
