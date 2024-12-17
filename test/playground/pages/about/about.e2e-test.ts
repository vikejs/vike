import { expect, fetchHtml, test } from '@brillout/test-e2e'

function testCumulativeSetting() {
  test('Cumulative setting (not serialized but imported)', async () => {
    let html: string
    const expectGlobalMetaTags = () => {
      expect(html).toContain('<meta charSet="UTF-8"/>')
      expect(html).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0"/>')
    }
    const expectAboutMetaTags = () => {
      expect(html).toContain('<meta name="description" content="Playground for testing."/>')
    }

    html = await fetchHtml('/')
    expectGlobalMetaTags()

    html = await fetchHtml('/about')
    expectAboutMetaTags()
    expectGlobalMetaTags()
  })
}

export default [testCumulativeSetting]
