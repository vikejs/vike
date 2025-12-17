import { expect, describe, it } from 'vitest'
import { isHtml } from './isHtml.js'

describe('isHtml()', () => {
  it('works', () => {
    // Correctly identified as not HTML:
    expect(isHtml('Hello, World')).toBe(false)
    expect(isHtml('This is less than <, this is greater than >.')).toBe(false)
    expect(isHtml(' a < 3 && b > 3')).toBe(false)
    expect(isHtml('<<Important Text>>')).toBe(false)
    expect(isHtml('<a>')).toBe(false)

    // Correctly identified as HTML
    expect(isHtml('<a>Foo</a>')).toBe(true)
    expect(isHtml("<input type='submit' value='Ok' />")).toBe(true)
    expect(isHtml('<br/>')).toBe(true)

    // We don't handle, but could with more tweaking:
    expect(isHtml('<br>')).toBe(false)
    expect(isHtml('Foo &amp; bar')).toBe(false)
    expect(isHtml("<input type='submit' value='Ok'>")).toBe(false)
  })
})
