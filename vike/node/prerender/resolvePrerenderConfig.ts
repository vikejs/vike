export { resolvePrerenderConfigGlobal }
export { resolvePrerenderConfigLocal }

import { VikeConfigObject } from '../plugin/plugins/importUserCode/v1-design/getVikeConfig.js'
import { assert, isArray, objectAssign } from './utils.js'
import { getConfigValueBuildTime } from '../../shared/page-configs/getConfigValueBuildTime.js'
import type { PageConfigBuildTime } from '../../shared/page-configs/PageConfig.js'

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

  const prerenderConfigGlobalLocalValue = prerenderConfigList.map((c) => c.value).filter((v) => v !== null)
  const defaultLocalValue =
    pickFirst(prerenderConfigGlobalLocalValue) ??
    (prerenderConfigGlobalLocalValue.length > 0 ||
      // Backwards compatibility for with vike({ prerender: true }) in vite.config.js
      prerenderConfigs?.some((p) => p === true) ||
      false)
  objectAssign(prerenderConfigGlobal, {
    defaultLocalValue,
    isEnabled:
      defaultLocalValue || vikeConfig.pageConfigs.some((pageConfig) => resolvePrerenderConfigLocal(pageConfig)?.value)
  })

  return prerenderConfigGlobal
}
function resolvePrerenderConfigLocal(pageConfig: PageConfigBuildTime) {
  const configValue = getConfigValueBuildTime(pageConfig, 'prerender')
  if (!configValue) return null
  const values = configValue.value
  assert(isArray(values))
  const value = values[0]
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
