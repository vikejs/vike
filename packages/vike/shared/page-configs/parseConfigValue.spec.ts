import { expect, describe, it } from 'vitest'
import { parseConfigValue, isConfigValueDefinitionObject, isArrayOfConfigValueDefinitions } from './parseConfigValue.js'

describe('parseConfigValue()', () => {
  describe('simple values', () => {
    it('handles string values', () => {
      expect(parseConfigValue('test')).toEqual({ value: 'test' })
    })

    it('handles number values', () => {
      expect(parseConfigValue(42)).toEqual({ value: 42 })
    })

    it('handles boolean values', () => {
      expect(parseConfigValue(true)).toEqual({ value: true })
      expect(parseConfigValue(false)).toEqual({ value: false })
    })

    it('handles object values', () => {
      const obj = { key: 'value' }
      expect(parseConfigValue(obj)).toEqual({ value: obj })
    })

    it('handles array values (non-config-definition arrays)', () => {
      const arr = ['item1', 'item2']
      expect(parseConfigValue(arr)).toEqual({ value: arr })
    })
  })

  describe('config value definition objects', () => {
    it('handles basic config value definition', () => {
      const configDef = { value: 'test-value' }
      expect(parseConfigValue(configDef)).toEqual({ value: 'test-value' })
    })

    it('handles config value definition with default', () => {
      const configDef = { value: 'test-value', default: true }
      expect(parseConfigValue(configDef)).toEqual({ 
        value: 'test-value', 
        default: true 
      })
    })

    it('handles config value definition with inherit', () => {
      const configDef = { value: 'test-value', inherit: false }
      expect(parseConfigValue(configDef)).toEqual({ 
        value: 'test-value', 
        inherit: false 
      })
    })

    it('handles config value definition with group', () => {
      const configDef = { value: 'test-value', group: 'test-group' }
      expect(parseConfigValue(configDef)).toEqual({ 
        value: 'test-value', 
        group: 'test-group' 
      })
    })

    it('handles config value definition with all properties', () => {
      const configDef = { 
        value: 'test-value', 
        default: true, 
        inherit: false, 
        group: 'test-group' 
      }
      expect(parseConfigValue(configDef)).toEqual({ 
        value: 'test-value', 
        default: true, 
        inherit: false, 
        group: 'test-group' 
      })
    })
  })

  describe('arrays of config value definitions', () => {
    it('handles array of config value definitions', () => {
      const configDefs = [
        { value: 'value1', group: 'group1' },
        { value: 'value2', group: 'group2' }
      ]
      expect(parseConfigValue(configDefs)).toEqual({ value: configDefs })
    })

    it('handles mixed array with different properties', () => {
      const configDefs = [
        { value: 'value1', default: true },
        { value: 'value2', inherit: false },
        { value: 'value3', group: 'group3' }
      ]
      expect(parseConfigValue(configDefs)).toEqual({ value: configDefs })
    })
  })
})

describe('isConfigValueDefinitionObject()', () => {
  it('returns true for valid config value definition objects', () => {
    expect(isConfigValueDefinitionObject({ value: 'test' })).toBe(true)
    expect(isConfigValueDefinitionObject({ value: 'test', default: true })).toBe(true)
    expect(isConfigValueDefinitionObject({ value: 'test', inherit: false })).toBe(true)
    expect(isConfigValueDefinitionObject({ value: 'test', group: 'group' })).toBe(true)
  })

  it('returns false for invalid objects', () => {
    expect(isConfigValueDefinitionObject({})).toBe(false)
    expect(isConfigValueDefinitionObject({ default: true })).toBe(false)
    expect(isConfigValueDefinitionObject({ inherit: false })).toBe(false)
    expect(isConfigValueDefinitionObject({ group: 'group' })).toBe(false)
  })

  it('returns false for non-objects', () => {
    expect(isConfigValueDefinitionObject('string')).toBe(false)
    expect(isConfigValueDefinitionObject(42)).toBe(false)
    expect(isConfigValueDefinitionObject(true)).toBe(false)
    expect(isConfigValueDefinitionObject(null)).toBe(false)
    expect(isConfigValueDefinitionObject(undefined)).toBe(false)
    expect(isConfigValueDefinitionObject([])).toBe(false)
  })
})

describe('isArrayOfConfigValueDefinitions()', () => {
  it('returns true for arrays of config value definitions', () => {
    expect(isArrayOfConfigValueDefinitions([
      { value: 'test1' },
      { value: 'test2' }
    ])).toBe(true)

    expect(isArrayOfConfigValueDefinitions([
      { value: 'test1', group: 'group1' },
      { value: 'test2', group: 'group2' }
    ])).toBe(true)
  })

  it('returns false for empty arrays', () => {
    expect(isArrayOfConfigValueDefinitions([])).toBe(false)
  })

  it('returns false for arrays with mixed content', () => {
    expect(isArrayOfConfigValueDefinitions([
      { value: 'test1' },
      'string'
    ])).toBe(false)

    expect(isArrayOfConfigValueDefinitions([
      { value: 'test1' },
      { notValue: 'test2' }
    ])).toBe(false)
  })

  it('returns false for regular arrays', () => {
    expect(isArrayOfConfigValueDefinitions(['item1', 'item2'])).toBe(false)
    expect(isArrayOfConfigValueDefinitions([1, 2, 3])).toBe(false)
    expect(isArrayOfConfigValueDefinitions([{ key: 'value' }])).toBe(false)
  })

  it('returns false for non-arrays', () => {
    expect(isArrayOfConfigValueDefinitions('string')).toBe(false)
    expect(isArrayOfConfigValueDefinitions({ value: 'test' })).toBe(false)
    expect(isArrayOfConfigValueDefinitions(null)).toBe(false)
    expect(isArrayOfConfigValueDefinitions(undefined)).toBe(false)
  })
})
