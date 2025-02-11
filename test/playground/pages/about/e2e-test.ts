export { testCumulativeSetting }

import { expect, fetchHtml, partRegex, test } from '@brillout/test-e2e'

function testCumulativeSetting({ isDev }: { isDev: boolean }) {
  test('Cumulative setting (not serialized but imported)', async () => {
    let html: string
    const expectGlobalMetaTags = () => {
      expect(html).toContain('<meta charSet="UTF-8"/>')
      expect(html).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0"/>')
    }
    const expectAboutMetaTags = () => {
      expect(html).toContain('<meta name="description" content="Playground for testing."/>')
    }
    const expectFavicon = () => {
      if (isDev) {
        expect(html).toContain('<link rel="icon" href="/pages/logo.svg"/>')
      } else {
        expect(html).toMatch(partRegex`<link rel="icon" href="${/[^"]+/}.svg"/>`)
      }
    }

    html = await fetchHtml('/')
    expectGlobalMetaTags()
    expectFavicon()

    html = await fetchHtml('/about')
    expectAboutMetaTags()
    expectGlobalMetaTags()
    expectFavicon()
  })
}
