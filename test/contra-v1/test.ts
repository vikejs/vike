export { test }

import { expect, describe, it } from 'vitest'
import { renderPage } from '../../vike/node/runtime'

function test() {
  describe('Contra Simulation', () => {
    it(
      'private properties',
      async () => {
        const pageContext: any = await renderPage({ urlOriginal: '/' })
        expect(pageContext.httpResponse).not.toBe(null)
        expect(pageContext._pageId).toBe('/pages/index')
        expect(pageContext._pageContextHtmlTag).toMatchSnapshot()
      },
      { timeout: 20 * 1000 }
    )
  })
}
