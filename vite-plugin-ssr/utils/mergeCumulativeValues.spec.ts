import { mergeCumulativeValues } from './mergeCumulativeValues.js'
import { expect, describe, it } from 'vitest'

describe('mergeCumulativeValues()', () => {
  const set1 = new Set()
  set1.add('42')
  set1.add(1337)
  const set2 = new Set()
  set2.add(7)
  set2.add(1337)
  const setMerged = new Set(['42', 7, 1337])
  const setErnous = new Set(['42', 7, 1337, 's'])
  it('merges arrays', () => {
    expect(mergeCumulativeValues([[1]])).toEqual([1])
    expect(mergeCumulativeValues([[1, true]])).toEqual([1, true])
    expect(mergeCumulativeValues([[1], [true]])).toEqual([1, true])
    expect(mergeCumulativeValues([[]])).toEqual([])
    expect(mergeCumulativeValues([[], [], [], []])).toEqual([])
  })
  it('merges sets', () => {
    expect(mergeCumulativeValues([set1, set2])).toEqual(setMerged)
    expect(mergeCumulativeValues([set1, set2])).not.toEqual(setErnous)
  })
  it('returns null otherwise', () => {
    expect(mergeCumulativeValues([1])).toEqual(null)
    expect(mergeCumulativeValues([1, []])).toEqual(null)
    expect(mergeCumulativeValues([1, new Set()])).toEqual(null)
    expect(mergeCumulativeValues([{}])).toEqual(null)
    expect(mergeCumulativeValues([])).toEqual(null)
  })
})
