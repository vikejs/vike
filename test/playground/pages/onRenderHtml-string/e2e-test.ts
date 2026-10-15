export { testOnRenderHtmlString }

import { expect, expectLog, fetchHtml, test } from '@brillout/test-e2e'

function testOnRenderHtmlString() {
  test('onRenderHtml() returning a plain string', async () => {
    expect(await fetchHtml('/onRenderHtml-string')).toContain('<p>Plain string</p>')
    expectLog('returned a plain JavaScript string which is dangerous')
  })
}
