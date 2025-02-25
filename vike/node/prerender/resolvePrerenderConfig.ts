export { resolvePrerenderConfigGlobal }
export { resolvePrerenderConfigLocal }

import type { ConfigResolved } from '../../shared/page-configs/Config/PageContextConfig.js'
import { VikeConfigObject } from '../plugin/plugins/importUserCode/v1-design/getVikeConfig.js'
import { assert, isArray } from './utils.js'
import { getConfigValueBuildTime } from '../../shared/page-configs/getConfigValueBuildTime.js'
import type { PageConfigBuildTime } from '../../shared/page-configs/PageConfig.js'
import { getConfigValueFilePathToShowToUser } from '../../shared/page-configs/helpers.js'

type PrerenderConfigSemiResolved = ConfigResolved['prerender']
type PrerenderConfig = false | Exclude<Required<NonNullable<PrerenderConfigSemiResolved>[number]>, boolean>

// TODO/now:
// - prerender.value

function resolvePrerenderConfigGlobal(vikeConfig: VikeConfigObject): PrerenderConfig {
  const prerenderConfigs = vikeConfig.global.config.prerender
  if (
    !prerenderConfigs &&
    !vikeConfig.pageConfigs.some((pageConfig) => resolvePrerenderConfigLocal(pageConfig)?.value)
  ) {
    return false
  }
  let prerenderSettings = prerenderConfigs || []
  // Needed because of backwards compatibility of `vike({prerender:true})` in `vite.config.js`; after we remove it we can remove this line.
  prerenderSettings = prerenderSettings.filter(isObject2)
  assert(prerenderSettings.every(isObject2)) // Help TS
  const prerenderConfig: PrerenderConfig = {
    partial: pickFirst(prerenderSettings.map((c) => c.partial)) ?? false,
    noExtraDir: pickFirst(prerenderSettings.map((c) => c.noExtraDir)) ?? false,
    parallel: pickFirst(prerenderSettings.map((c) => c.parallel)) ?? true,
    disableAutoRun: pickFirst(prerenderSettings.map((c) => c.disableAutoRun)) ?? false
  }
  return prerenderConfig
}
function resolvePrerenderConfigLocal(pageConfig: PageConfigBuildTime) {
  const configValue = getConfigValueBuildTime(pageConfig, 'prerender')
  if (!configValue) return null
  const values = configValue.value
  assert(isArray(values))
  const value = values[0]
  assert(typeof value === 'boolean')
  assert(isArray(configValue.definedAtData))
  const configValueFilePathToShowToUser = getConfigValueFilePathToShowToUser(configValue.definedAtData[0]!)
  assert(configValueFilePathToShowToUser)
  return { value, configValueFilePathToShowToUser }
}

function isObject2<T>(p: T | boolean | undefined): p is T {
  return typeof p === 'object' && p !== null
}
function pickFirst<T>(arr: T[]): T | undefined {
  return arr.filter((v) => v !== undefined)[0]
}
