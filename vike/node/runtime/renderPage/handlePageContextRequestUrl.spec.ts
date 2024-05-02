import { removePageContextUrlSuffix } from './handlePageContextRequestUrl'
import { expect, describe, it } from 'vitest'

describe('removePageContextUrlSuffix()', () => {
  it('contain slash for root paths', () => {
    expect(
      removePageContextUrlSuffix('/index.pageContext.json')
    ).toMatchInlineSnapshot('"/"')
  })
})
