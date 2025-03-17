export { resolvePrerenderConfigGlobal }
export { resolvePrerenderConfigLocal }

import { VikeConfigObject } from '../plugin/plugins/importUserCode/v1-design/getVikeConfig.js'
import { assert, isArray, isObject, objectAssign } from './utils.js'
import { getConfigValueBuildTime } from '../../shared/page-configs/getConfigValueBuildTime.js'
import type { PageConfigBuildTime } from '../../shared/page-configs/PageConfig.js'

// When setting +prerender to an object => it also enables pre-rendering
const defaultValueForObject = true

function resolvePrerenderConfigGlobal(vikeConfig: VikeConfigObject) {
  const prerenderConfigs = vikeConfig.global.config.prerender || []

  const prerenderSettings = prerenderConfigs.filter(isObject2)
  const prerenderConfigGlobal = {
    partial: pickFirst(prerenderSettings.map((c) => c.partial)) ?? false,
    noExtraDir: pickFirst(prerenderSettings.map((c) => c.noExtraDir)) ?? false,
    parallel: pickFirst(prerenderSettings.map((c) => c.parallel)) ?? true,
    disableAutoRun: pickFirst(prerenderSettings.map((c) => c.disableAutoRun)) ?? false
  } satisfies Record<string, boolean | number>

  let defaultLocalValue = false
  {
    const valueFirst = prerenderConfigs.filter((p) => !isObject(p) || p.enable !== null)[0]
    if (valueFirst === true || (isObject(valueFirst) && (valueFirst.enable ?? defaultValueForObject))) {
      defaultLocalValue = true
    }
  }
  // TODO/next-major: remove
  // Backwards compatibility for `vike({prerender:true})` in vite.config.js
  {
    const valuesWithDefinedAt = vikeConfig.global._from.configsCumulative.prerender?.values ?? []
    if (valuesWithDefinedAt.some((v) => v.definedAt.includes('vite.config.js') && v.value)) {
      defaultLocalValue = true
    }
  }

  objectAssign(prerenderConfigGlobal, {
    defaultLocalValue,
    isPrerenderingEnabledForAllPages:
      vikeConfig.pageConfigs.length > 0 &&
      vikeConfig.pageConfigs.every((pageConfig) => resolvePrerenderConfigLocal(pageConfig)?.value ?? defaultLocalValue),
    isPrerenderingEnabled:
      vikeConfig.pageConfigs.length > 0 &&
      vikeConfig.pageConfigs.some((pageConfig) => resolvePrerenderConfigLocal(pageConfig)?.value ?? defaultLocalValue)
  })

  // TODO/next-major remove
  if (vikeConfig.pageConfigs.length === 0 && defaultLocalValue) prerenderConfigGlobal.isPrerenderingEnabled = true

  return prerenderConfigGlobal
}
function resolvePrerenderConfigLocal(pageConfig: PageConfigBuildTime) {
  const configValue = getConfigValueBuildTime(pageConfig, 'prerender')
  if (!configValue) return null
  const values = configValue.value
  assert(isArray(values))
  const value = values[0]
  // TODO/now I believe this assert() can fail
  assert(typeof value === 'boolean')
  assert(isArray(configValue.definedAtData))
  const prerenderConfigLocal = { value }
  return prerenderConfigLocal
}

function isObject2<T extends Record<string, unknown>>(value: T | boolean | undefined): value is T {
  return typeof value === 'object' && value !== null
}
function pickFirst<T>(arr: T[]): T | undefined {
  return arr.filter((v) => v !== undefined)[0]
}
