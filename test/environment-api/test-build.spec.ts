import { describe, expect, test } from 'vitest'

describe('build', () => {
  test('prevented', { timeout: 20 * 1000 }, async () => {
    await import('./build')
    expect('success').toBe('success')
  })
})
