export { resolvePrerenderConfig }

import type { ConfigResolved } from '../../shared/page-configs/Config/PageContextConfig.js'

type PrerenderConfigSemiResolved = ConfigResolved['prerender']
type PrerenderConfig = false | Exclude<Required<NonNullable<PrerenderConfigSemiResolved>[number]>, boolean>

// TODO/now:
// - prerender.value
// - correct isPrerendering

function resolvePrerenderConfig(prerenderConfigs: PrerenderConfigSemiResolved): PrerenderConfig {
  if (!prerenderConfigs || prerenderConfigs.every((configVal) => !configVal)) {
    return false
  }
  const prerenderSettings = prerenderConfigs.filter(isObject2)
  const prerenderConfig: PrerenderConfig = {
    partial: pickFirst(prerenderSettings.map((c) => c.partial)) ?? false,
    noExtraDir: pickFirst(prerenderSettings.map((c) => c.noExtraDir)) ?? false,
    parallel: pickFirst(prerenderSettings.map((c) => c.parallel)) ?? true,
    disableAutoRun: pickFirst(prerenderSettings.map((c) => c.disableAutoRun)) ?? false
  }
  return prerenderConfig
}
function isObject2<T>(p: T | boolean | undefined): p is T {
  return typeof p === 'object'
}
function pickFirst<T>(arr: T[]): T | undefined {
  return arr.filter((v) => v !== undefined)[0]
}
