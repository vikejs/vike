export { applyInheritanceRules }

import type { ConfigValueSource } from '../../types/PageConfig.js'

function applyInheritanceRules(sources: ConfigValueSource[]): ConfigValueSource[] {
  const sourcesByGroup = new Map<string | undefined, ConfigValueSource[]>()

  sources.forEach((source) => {
    const groupKey = source.configValueGroup
    if (!sourcesByGroup.has(groupKey)) {
      sourcesByGroup.set(groupKey, [])
    }
    sourcesByGroup.get(groupKey)!.push(source)
  })

  const result: ConfigValueSource[] = []

  sourcesByGroup.forEach((groupSources) => {
    const groupResult = processGroup(groupSources)
    result.push(...groupResult)
  })

  return result
}

function processGroup(groupSources: ConfigValueSource[]): ConfigValueSource[] {
  const noInheritSources = groupSources.filter(source => source.configValueInherit === false)

  if (noInheritSources.length > 0) {
    return [noInheritSources[0]!]
  }

  const hasNonDefaultValue = groupSources.some(source => source.configValueDefault !== true)
  const result: ConfigValueSource[] = []

  for (const source of groupSources) {
    if (source.configValueDefault === true && hasNonDefaultValue) {
      continue
    }
    result.push(source)
  }

  return result
}
