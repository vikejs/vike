import { buildApp } from './buildApp'
import { describe, expect, test } from 'vitest'

describe('build', () => {
  test('prevented', { timeout: 20 * 1000 }, async () => {
    await buildApp()
    expect('success').toBe('success')
  })
})
