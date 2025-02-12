export { testSettingsInheritance }

import { expect, fetchHtml, partRegex, test } from '@brillout/test-e2e'

function testSettingsInheritance({ isDev }: { isDev: boolean }) {
  test('settings inheritance', async () => {
    let html: string
    const expectGlobalMetaTags = () => {
      expect(html).toContain('<meta charSet="UTF-8"/>')
      expect(html).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0"/>')
    }
    // TEST: cumulative setting (not serialized but imported)
    const expectAboutMetaTags = (shouldBeMissing: boolean) => {
      const val = '<meta name="description" content="Playground for testing."/>'
      if (!shouldBeMissing) {
        expect(html).toContain(val)
      } else {
        expect(html).not.toContain(val)
      }
    }
    const expectFavicon = () => {
      if (isDev) {
        expect(html).toContain('<link rel="icon" href="/pages/logo.svg"/>')
      } else {
        expect(html).toMatch(partRegex`<link rel="icon" href="${/[^"]+/}.svg"/>`)
      }
    }
    // TEST: global setting
    const expectHtmlAttributes = () => {
      expect(html).toContain('<html class="dark" lang="en">')
    }

    html = await fetchHtml('/')
    expectGlobalMetaTags()
    expectAboutMetaTags(true)
    expectFavicon()
    expectHtmlAttributes()

    html = await fetchHtml('/about')
    expectGlobalMetaTags()
    expectAboutMetaTags(false)
    expectFavicon()
    expectHtmlAttributes()
  })
}
