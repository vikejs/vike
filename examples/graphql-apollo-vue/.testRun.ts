export { testRun }

import { fetchHtml, run, test, expect, skip } from '@brillout/test-e2e'

function testRun(cmd: 'npm run dev' | 'npm run prod') {
  {
    skip('SKIPPED until it supports Vite 4')
    return
  }

  run(cmd)

  test('page is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<p>List of countries.')
    expect(html).toContain('<li>Angola</li><li>Antarctica</li><li>Argentina</li><li>American Samoa</li>')
  })
}
