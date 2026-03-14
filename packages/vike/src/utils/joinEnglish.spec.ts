import { describe, expect, it } from 'vitest'
import { joinEnglish } from './joinEnglish.js'

describe('joinEnglish()', () => {
  it('uses an Oxford comma by default', () => {
    expect(joinEnglish(['apples', 'bananas', 'cherries'], 'and')).toBe('apples, bananas, and cherries')
  })

  it('can omit the trailing comma', () => {
    expect(joinEnglish(['apples', 'bananas', 'cherries'], 'and', undefined, { trailingComma: false })).toBe(
      'apples, bananas and cherries',
    )
  })
})
