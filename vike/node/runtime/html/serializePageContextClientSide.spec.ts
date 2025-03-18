import { describe, it, expect } from 'vitest'
import { getPropKeys } from './serializePageContextClientSide'

describe('getPropKeys', () => {
  it('should split on unescaped dots', () => {
    expect(getPropKeys('a.b.c')).toEqual(['a', 'b', 'c'])
  })

  it('should handle escaped dots', () => {
    expect(getPropKeys('a\\.b.c')).toEqual(['a.b', 'c'])
    expect(getPropKeys('a\\.b\\.c')).toEqual(['a.b.c'])
  })

  it('should handle escaped backslashes', () => {
    expect(getPropKeys('a\\\\b.c')).toEqual(['a\\b', 'c'])
    expect(getPropKeys('a\\\\\\.b.c')).toEqual(['a\\.b', 'c'])
  })

  it('should handle mixed escaped and unescaped dots', () => {
    expect(getPropKeys('a.b\\.c.d')).toEqual(['a', 'b.c', 'd'])
    expect(getPropKeys('a\\.b.c\\.d.e')).toEqual(['a.b', 'c.d', 'e'])
  })

  it('should handle empty strings', () => {
    expect(getPropKeys('')).toEqual([''])
  })

  it('should handle strings without dots', () => {
    expect(getPropKeys('abc')).toEqual(['abc'])
  })

  it('should handle strings with only escaped dots', () => {
    expect(getPropKeys('a\\.b\\.c\\.d')).toEqual(['a.b.c.d'])
  })

  it('should handle strings with only backslashes', () => {
    expect(getPropKeys('a\\\\b\\\\c')).toEqual(['a\\b\\c'])
  })
})
