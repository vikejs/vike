import { describe, expect, it } from 'vitest'
import { joinEnglish } from './joinEnglish.js'

describe('joinEnglish()', () => {
  it('uses an Oxford comma by default', () => {
    expect(joinEnglish(['apples', 'bananas', 'cherries'], 'and')).toBe('apples, bananas, and cherries')
  })

  it('can omit the trailing comma', () => {
    expect(joinEnglish(['apples', 'bananas', 'cherries'], 'and', { trailingComma: false })).toBe(
      'apples, bananas and cherries',
    )
  })

  it('can colorize entries through options', () => {
    expect(joinEnglish(['apples', 'bananas'], 'or', { color: (s) => `[${s}]` })).toBe('[apples] or [bananas]')
  })
})
