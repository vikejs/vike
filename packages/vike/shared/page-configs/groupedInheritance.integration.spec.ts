import { describe, it, expect } from 'vitest'
import { parseConfigValue } from './parseConfigValue.js'

describe('parseConfigValue', () => {
  it('should parse simple values', () => {
    const result = parseConfigValue('test-value')
    
    expect(result.value).toBe('test-value')
    expect(result.default).toBeUndefined()
    expect(result.inherit).toBeUndefined()
    expect(result.group).toBeUndefined()
  })

  it('should parse config objects', () => {
    const result = parseConfigValue({
      value: 'test-value',
      default: true,
      inherit: false,
      group: 'test-group'
    })
    
    expect(result.value).toBe('test-value')
    expect(result.default).toBe(true)
    expect(result.inherit).toBe(false)
    expect(result.group).toBe('test-group')
  })

  it('should handle partial config objects', () => {
    const result = parseConfigValue({
      value: 'test-value',
      inherit: false
    })
    
    expect(result.value).toBe('test-value')
    expect(result.inherit).toBe(false)
    expect(result.default).toBeUndefined()
    expect(result.group).toBeUndefined()
  })
})
