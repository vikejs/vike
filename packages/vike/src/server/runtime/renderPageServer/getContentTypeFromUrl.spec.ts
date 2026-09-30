import { getContentTypeFromUrl } from './getContentTypeFromUrl.js'
import { expect, describe, it } from 'vitest'

describe('getContentTypeFromUrl', () => {
  it('file extension', () => {
    expect(getContentTypeFromUrl('/feed.atom')).toBe('application/atom+xml;charset=utf-8')
    expect(getContentTypeFromUrl('/blog/rss.xml')).toBe('application/xml;charset=utf-8')
    expect(getContentTypeFromUrl('/feed.rss')).toBe('application/rss+xml;charset=utf-8')
    expect(getContentTypeFromUrl('/data.json')).toBe('application/json')
    expect(getContentTypeFromUrl('/robots.txt')).toBe('text/plain;charset=utf-8')
    expect(getContentTypeFromUrl('/llms.md')).toBe('text/markdown;charset=utf-8')
    expect(getContentTypeFromUrl('/og/image.png')).toBe('image/png')
    expect(getContentTypeFromUrl('/logo.svg')).toBe('image/svg+xml')
  })
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
