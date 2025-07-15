export { parseConfigValue }
export { isConfigValueDefinitionObject }
export { isArrayOfConfigValueDefinitions }
export type { ParsedConfigValue }


import type { ConfigValueDefinition, ConfigValueDefinitionObject } from '../../types/PageConfig.js'

type ParsedConfigValue = {
  value: unknown
  default?: boolean
  inherit?: boolean
  group?: string
}

/**
 * Parses a config value definition to extract the actual value and inheritance control properties.
 * Supports both simple values (backward compatibility) and object definitions with inheritance control.
 */
function parseConfigValue(configValueDefinition: ConfigValueDefinition): ParsedConfigValue {
  // Handle arrays of config value definitions
  if (Array.isArray(configValueDefinition)) {
    // For arrays, we return the array as the value and let the cumulative logic handle each element
    return { value: configValueDefinition }
  }

  // Handle simple values (backward compatibility)
  if (!isConfigValueDefinitionObject(configValueDefinition)) {
    return { value: configValueDefinition }
  }

  // Handle object definitions with inheritance control
  const { value, default: defaultValue, inherit, group } = configValueDefinition

  const parsed: ParsedConfigValue = { value }
  if (defaultValue !== undefined) parsed.default = defaultValue
  if (inherit !== undefined) parsed.inherit = inherit
  if (group !== undefined) parsed.group = group

  return parsed
}

/**
 * Type guard to check if a value is a ConfigValueDefinitionObject
 */
function isConfigValueDefinitionObject(value: unknown): value is ConfigValueDefinitionObject {
  if (value === null || value === undefined) return false
  if (typeof value !== 'object') return false
  if (Array.isArray(value)) return false
  
  const obj = value as Record<string, unknown>
  
  // Must have a 'value' property
  if (!('value' in obj)) return false
  
  // Can only have specific properties
  const allowedKeys = new Set(['value', 'default', 'inherit', 'group'])
  const keys = Object.keys(obj)
  
  for (const key of keys) {
    if (!allowedKeys.has(key)) return false
  }
  
  // Type check the optional properties
  if ('default' in obj && typeof obj.default !== 'boolean') return false
  if ('inherit' in obj && typeof obj.inherit !== 'boolean') return false
  if ('group' in obj && typeof obj.group !== 'string') return false
  
  return true
}

/**
 * Type guard to check if a value is an array of ConfigValueDefinitionObjects
 */
function isArrayOfConfigValueDefinitions(value: unknown): value is ConfigValueDefinitionObject[] {
  if (!Array.isArray(value)) return false
  if (value.length === 0) return false

  // All elements must be config value definition objects
  return value.every(item => isConfigValueDefinitionObject(item))
}
