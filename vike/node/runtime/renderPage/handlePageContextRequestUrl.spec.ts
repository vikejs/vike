import { removePageContextUrlSuffix } from './handlePageContextRequestUrl'
import { expect, describe, it } from 'vitest'

describe('removePageContextUrlSuffix()', () => {
  it('contain slash for root paths', () => {
    expect(
      removePageContextUrlSuffix('https://example.com/index.pageContext.json')
    ).toMatchInlineSnapshot('"https://example.com/"')
  })
  it('remove suffix', () => {
    expect(
      removePageContextUrlSuffix('https://example.com/test/index.pageContext.json')
    ).toMatchInlineSnapshot('"https://example.com/test"')
  })
  it('remove suffix with query and hash', () => {
    expect(
      removePageContextUrlSuffix('https://example.com/test/index.pageContext.json?query=1#hash')
    ).toMatchInlineSnapshot('"https://example.com/test?query=1#hash"')
  })
  it('contain slash for root paths with trailing slash', () => {
    expect(
      removePageContextUrlSuffix('https://example.com/index.pageContext.json/')
    ).toMatchInlineSnapshot('"https://example.com/"')
  })
  it('remove suffix with trailing slash', () => {
    expect(
      removePageContextUrlSuffix('https://example.com/test/index.pageContext.json/')
    ).toMatchInlineSnapshot('"https://example.com/test/"')
  })
  it('remove suffix with query and hash with trailing slash', () => {
    expect(
      removePageContextUrlSuffix('https://example.com/test/index.pageContext.json/?query=1#hash')
    ).toMatchInlineSnapshot('"https://example.com/test/?query=1#hash"')
  })
})
