import { removePageContextUrlSuffix } from './handlePageContextRequestUrl'
import { expect, describe, it } from 'vitest'

describe('removePageContextUrlSuffix()', () => {
  it('contain slash for root paths', () => {
    expect(
      removePageContextUrlSuffix('/index.pageContext.json')
    ).toMatchInlineSnapshot('"/"')
  })
  it('remove suffix', () => {
    expect(
      removePageContextUrlSuffix('/test/index.pageContext.json')
    ).toMatchInlineSnapshot('"/test"')
  })
  it('remove suffix with query and hash', () => {
    expect(
      removePageContextUrlSuffix('/test/index.pageContext.json?query=1#hash')
    ).toMatchInlineSnapshot('"/test?query=1#hash"')
  })
  it('contain slash for root paths with trailing slash', () => {
    expect(
      removePageContextUrlSuffix('//index.pageContext.json')
    ).toMatchInlineSnapshot('"/"')
  })
  it('remove suffix with trailing slash', () => {
    expect(
      removePageContextUrlSuffix('/test//index.pageContext.json')
    ).toMatchInlineSnapshot('"/test/"')
  })
  it('remove suffix with trailing slash, query and hash', () => {
    expect(
      removePageContextUrlSuffix('/test//index.pageContext.json?query=1#hash')
    ).toMatchInlineSnapshot('"/test/?query=1#hash"')
  })
})
