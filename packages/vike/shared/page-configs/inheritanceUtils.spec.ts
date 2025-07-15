import { describe, it, expect } from 'vitest'
import { applyInheritanceRules } from './inheritanceUtils.js'

describe('applyInheritanceRules', () => {
  function createSource(
    options: {
      configValueDefault?: boolean
      configValueInherit?: boolean
      configValueGroup?: string
    } = {},
  ) {
    return {
      configValueDefault: options.configValueDefault,
      configValueInherit: options.configValueInherit,
      configValueGroup: options.configValueGroup,
    }
  }

  it('should handle inherit: false', () => {
    const sources = [createSource({ configValueInherit: false }), createSource({}), createSource({})]

    //@ts-ignore
    const result = applyInheritanceRules(sources)

    expect(result).toHaveLength(1)
    expect(result[0]?.configValueInherit).toBe(false)
  })

  it('should handle normal inheritance', () => {
    const sources = [createSource({}), createSource({}), createSource({})]

    //@ts-ignore
    const result = applyInheritanceRules(sources)

    expect(result).toHaveLength(3)
  })

  it('should skip default values when non-default exists', () => {
    const sources = [createSource({}), createSource({ configValueDefault: true }), createSource({})]

    //@ts-ignore
    const result = applyInheritanceRules(sources)

    expect(result).toHaveLength(2)
    expect(result.some((s) => s.configValueDefault === true)).toBe(false)
  })

  it('should process groups independently', () => {
    const sources = [
      createSource({ configValueGroup: 'a' }),
      createSource({ configValueGroup: 'a' }),
      createSource({ configValueGroup: 'b', configValueInherit: false }),
      createSource({ configValueGroup: 'b' }),
    ]

    //@ts-ignore
    const result = applyInheritanceRules(sources)

    expect(result).toHaveLength(3)
    const groupBSources = result.filter((s) => s.configValueGroup === 'b')
    expect(groupBSources).toHaveLength(1)
    expect(groupBSources[0]?.configValueInherit).toBe(false)
  })
})
