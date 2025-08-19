export { getConfigValueSourcesRelevant }
export { isRuntimeEnvMatch }
export type { RuntimeEnv }

import type {
  ConfigEnvInternal,
  ConfigValueSource,
  PageConfigBuildTime,
  PageConfigGlobalBuildTime,
} from '../../../../types/PageConfig.js'
import { assert } from '../../utils.js'

type RuntimeEnv = { isForClientSide: boolean; isClientRouting: boolean; isDev?: boolean } | { isForConfig: true }

function getConfigValueSourcesRelevant(configName: string, runtimeEnv: RuntimeEnv, pageConfig: PageConfigPartial) {
  const configDef = pageConfig.configDefinitions[configName]
  assert(configDef)
  let sourcesRelevant = pageConfig.configValueSources[configName]
  if (!sourcesRelevant) return []

  if (!configDef.cumulative) {
    const source = sourcesRelevant[0]
    if (source) {
      sourcesRelevant = [source]
    } else {
      assert(sourcesRelevant.length === 0)
    }
  } else {
    // isOverridden() must be called before isRuntimeEnvMatch() is called (otherwise isOverridden() will return a wrong value)
    sourcesRelevant = sourcesRelevant.filter((source) => !isOverridden(source, configName, pageConfig))
  }

  // Filter by runtime env
  sourcesRelevant = sourcesRelevant.filter((source) => isRuntimeEnvMatch(source.configEnv, runtimeEnv))

  // Apply cumulative modifiers (suffix-only: .clear., .default.)
  if (configDef.cumulative && sourcesRelevant.length > 0) {
    sourcesRelevant = applyCumulativeSuffixModifiers(sourcesRelevant)
  }

  return sourcesRelevant
}

function applyCumulativeSuffixModifiers(sourcesRelevant: ConfigValueSource[]) {
  const isSourceClear = (fn: string) => fn.includes('.clear.')
  const isSourceDefault = (fn: string) => fn.includes('.default.')

  const filenames = sourcesRelevant.map((s) => s.plusFile?.filePath.fileName || '')

  // Apply `clear`: keep up to and including the first clear, drop all ancestors after it
  const idxClear = filenames.findIndex((fn) => isSourceClear(fn))
  if (idxClear !== -1) {
    sourcesRelevant = sourcesRelevant.slice(0, idxClear + 1)
  }

  // Apply `default` semantics
  const filenamesAfterClear = sourcesRelevant.map((s) => s.plusFile?.filePath.fileName || '')
  const hasNonDefault = filenamesAfterClear.some((fn) => !isSourceDefault(fn))
  if (hasNonDefault) {
    sourcesRelevant = sourcesRelevant.filter((s) => !isSourceDefault(s.plusFile?.filePath.fileName || ''))
  } else if (sourcesRelevant.length > 1) {
    const first = sourcesRelevant[0]
    if (first) sourcesRelevant = [first]
  }

  return sourcesRelevant
}

function isRuntimeEnvMatch(configEnv: ConfigEnvInternal, runtimeEnv: RuntimeEnv): boolean {
  if ('isForConfig' in runtimeEnv) return !!configEnv.config

  // Runtime
  if (!runtimeEnv.isForClientSide) {
    if (!configEnv.server) return false
  } else {
    if (!configEnv.client) return false
    if (configEnv.client === 'if-client-routing' && !runtimeEnv.isClientRouting) return false
  }

  // Production/development
  if (configEnv.production !== undefined) {
    assert(typeof configEnv.production === 'boolean')
    assert(typeof runtimeEnv.isDev === 'boolean')
    if (configEnv.production) {
      if (runtimeEnv.isDev) return false
    } else {
      if (!runtimeEnv.isDev) return false
    }
  }

  return true
}

type PageConfigPartial = Pick<
  PageConfigBuildTime | PageConfigGlobalBuildTime,
  'configValueSources' | 'configDefinitions'
>
function isOverridden(source: ConfigValueSource, configName: string, pageConfig: PageConfigPartial): boolean {
  const configDef = pageConfig.configDefinitions[configName]
  assert(configDef)
  if (configDef.cumulative) return false
  const sources = pageConfig.configValueSources[configName]
  assert(sources)
  const idx = sources.indexOf(source)
  assert(idx >= 0)
  return idx > 0
}
