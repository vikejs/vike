import { getContentTypeFromUrl } from './getContentTypeFromUrl.js'
import { expect, describe, it } from 'vitest'

describe('getContentTypeFromUrl', () => {
  it('ignores search, hash, and case', () => {
    expect(getContentTypeFromUrl('/feed.atom?lang=en#top')).toBe('application/atom+xml;charset=utf-8')
    expect(getContentTypeFromUrl('https://example.com/data.JSON')).toBe('application/json')
    expect(getContentTypeFromUrl('/some.dir/file.txt')).toBe('text/plain;charset=utf-8')
    // trailingSlash: true
    expect(getContentTypeFromUrl('/feed.atom/')).toBe('application/atom+xml;charset=utf-8')
  })
  it('unknown or missing extension', () => {
    expect(getContentTypeFromUrl('/')).toBe('application/octet-stream')
    expect(getContentTypeFromUrl('/about')).toBe('application/octet-stream')
    expect(getContentTypeFromUrl('/some.dir/about')).toBe('application/octet-stream')
    expect(getContentTypeFromUrl('/file.unknown')).toBe('application/octet-stream')
    expect(getContentTypeFromUrl('/.env')).toBe('application/octet-stream')
    expect(getContentTypeFromUrl('/file.constructor')).toBe('application/octet-stream')
  })
})
