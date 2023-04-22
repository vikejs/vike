export { test }

import { expect, describe, it } from 'vitest'
import { renderPage } from '../../vite-plugin-ssr/node/runtime'

function test() {
  describe('Contra Simulation', () => {
    it('private properties', async () => {
      const pageContext: any = await renderPage({ urlOriginal: '/' })
      expect(pageContext.httpResponse).not.toBe(null)
      expect(pageContext._pageId).toBe('/pages/index')
      expect(pageContext._pageContextHtmlTag).toBe(
        '<script id="vite-plugin-ssr_pageContext" type="application/json">{"pageContext":{"_pageId":"/pages/index"}}</script>'
      )
    })
  })
}
