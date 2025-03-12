export { resolvePrerenderConfigGlobal }
export { resolvePrerenderConfigLocal }

import { VikeConfigObject } from '../plugin/plugins/importUserCode/v1-design/getVikeConfig.js'
import { assert, isArray, isObject, objectAssign } from './utils.js'
import { getConfigValueBuildTime } from '../../shared/page-configs/getConfigValueBuildTime.js'
import type { PageConfigBuildTime } from '../../shared/page-configs/PageConfig.js'

// When setting +prerender to an setting object => also enables pre-rendering
const defaultValueForObject = true

function resolvePrerenderConfigGlobal(vikeConfig: VikeConfigObject) {
  const prerenderConfigs = vikeConfig.global.config.prerender

  let prerenderConfigList = prerenderConfigs || []
  // Needed because of backwards compatibility of `vike({prerender:true})` in `vite.config.js`; after we remove it we can remove this line.
  prerenderConfigList = prerenderConfigList.filter(isObject2)
  assert(prerenderConfigList.every(isObject2)) // Help TS
  const prerenderConfigGlobal = {
    partial: pickFirst(prerenderConfigList.map((c) => c.partial)) ?? false,
    noExtraDir: pickFirst(prerenderConfigList.map((c) => c.noExtraDir)) ?? false,
    parallel: pickFirst(prerenderConfigList.map((c) => c.parallel)) ?? true,
    disableAutoRun: pickFirst(prerenderConfigList.map((c) => c.disableAutoRun)) ?? false
  }

  let defaultLocalValue = false
  {
    const valueFirst = prerenderConfigs?.[0]
    if (valueFirst === true || (isObject(valueFirst) && (valueFirst.value ?? defaultValueForObject))) {
      defaultLocalValue = true
    }
  }
  // TODO/next-major: remove
  // Backwards compatibility for with vike({ prerender: true }) in vite.config.js
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

function isObject2<T>(p: T | boolean | undefined): p is T {
  return typeof p === 'object' && p !== null
}
function pickFirst<T>(arr: T[]): T | undefined {
  return arr.filter((v) => v !== undefined)[0]
}
