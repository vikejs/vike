import { describe, it, expect } from 'vitest'
import { handlePageContextRequestUrl } from './handlePageContextRequestUrl.js'

describe('handlePageContextRequestUrl()', () => {
  it("gives the page's URL, as percent-encoded as the request's", () => {
    for (const origin of ['', 'http://localhost']) {
      for (const pageUrl of ['/', '/dash', '/%64ash', '/%2564ash', '/literal%25', '/a%20b']) {
        const url = `${origin}${pageUrl.replace(/\/$/, '')}/index.pageContext.json`
        expect(handlePageContextRequestUrl(url).urlWithoutPageContextRequestSuffix).toBe(`${origin}${pageUrl}`)
      }
    }
  })
})
