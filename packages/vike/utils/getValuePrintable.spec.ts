import { expect, describe, it } from 'vitest'
import { getValuePrintable } from './getValuePrintable.js'

describe('getValuePrintable()', () => {
  it('works', () => {
    expect(getValuePrintable('Hello, World')).toBe('"Hello, World"')
    expect(getValuePrintable('1')).toBe('"1"')
    expect(getValuePrintable('1"')).toBe('"1\\""')
    expect(getValuePrintable(1)).toBe('1')
    expect(getValuePrintable(true)).toBe('true')
    expect(getValuePrintable(false)).toBe('false')
    expect(getValuePrintable(undefined)).toBe('undefined')
    expect(getValuePrintable(null)).toBe('null')
  })
})
