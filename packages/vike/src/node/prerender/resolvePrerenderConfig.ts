export { resolvePrerenderConfigGlobal }
export { resolvePrerenderConfigLocal }

import { VikeConfigInternal } from '../vite/shared/resolveVikeConfigInternal.js'
import { assert, assertUsage, isArray, isObject, objectAssign } from './utils.js'
import { getConfigValueBuildTime } from '../../shared-server-client/page-configs/getConfigValueBuildTime.js'
import type { PageConfigBuildTime } from '../../types/PageConfig.js'
import { getConfigDefinedAt } from '../../shared-server-client/page-configs/getConfigDefinedAt.js'
import { isCallable } from '../../utils/isCallable.js'

// +prerender is callable but getGlobalContext() cannot be used (see https://github.com/vikejs/vike/issues/3002#issuecomment-3703878380) but it's still usefull (see https://github.com/vikejs/vike/issues/3002#issuecomment-3704141813)

// When setting +prerender to an object => it enables pre-rendering
const defaultValueForObject = true

async function resolvePrerenderConfigGlobal(vikeConfig: Pick<VikeConfigInternal, 'config' | '_pageConfigs' | '_from'>) {
  const prerenderConfigs = vikeConfig.config.prerender || []
  const prerenderConfigsResolved = await Promise.all(
    prerenderConfigs.map((config) => (isCallable(config) ? config() : config)),
  )

  const prerenderSettings = prerenderConfigsResolved.filter(isObject2)
  const prerenderConfigGlobal = {
    partial: pickFirst(prerenderSettings.map((c) => c.partial)) ?? false,
    redirects: pickFirst(prerenderSettings.map((c) => c.redirects)) ?? null,
    noExtraDir: pickFirst(prerenderSettings.map((c) => c.noExtraDir)) ?? null,
    keepDistServer: pickFirst(prerenderSettings.map((c) => c.keepDistServer)) ?? false,
    parallel: pickFirst(prerenderSettings.map((c) => c.parallel)) ?? true,
    disableAutoRun: pickFirst(prerenderSettings.map((c) => c.disableAutoRun)) ?? false,
  } satisfies Record<string, boolean | number | null>

  let defaultLocalValue = false
  {
    const valueFirst = prerenderConfigsResolved.filter((p) => !isObject(p) || p.enable !== null)[0]
    if (valueFirst === true || (isObject(valueFirst) && (valueFirst.enable ?? defaultValueForObject))) {
      defaultLocalValue = true
    }
  }
  // TO-DO/next-major-release: remove
  // Backwards compatibility for `vike({prerender:true})` in vite.config.js
  {
    const valuesWithDefinedAt = vikeConfig._from.configsCumulative.prerender?.values ?? []
    if (valuesWithDefinedAt.some((v) => v.definedAt.includes('vite.config.js') && v.value)) {
      defaultLocalValue = true
    }
  }

  const pageConfigResults = await Promise.all(
    vikeConfig._pageConfigs.map((pageConfig) => resolvePrerenderConfigLocal(pageConfig)),
  )
  objectAssign(prerenderConfigGlobal, {
    defaultLocalValue,
    isPrerenderingEnabledForAllPages:
      vikeConfig._pageConfigs.length > 0 && pageConfigResults.every((result) => result?.value ?? defaultLocalValue),
    isPrerenderingEnabled:
      vikeConfig._pageConfigs.length > 0 && pageConfigResults.some((result) => result?.value ?? defaultLocalValue),
  })

  // TO-DO/next-major-release: remove
  if (vikeConfig._pageConfigs.length === 0 && defaultLocalValue) prerenderConfigGlobal.isPrerenderingEnabled = true

  return prerenderConfigGlobal
}
async function resolvePrerenderConfigLocal(pageConfig: PageConfigBuildTime) {
  const configValue = getConfigValueBuildTime(pageConfig, 'prerender')
  if (!configValue) return null
  const values = configValue.value
  assert(isArray(values))
  let value = values[0]
  if (isCallable(value)) value = await value()
  assert(isArray(configValue.definedAtData))
  const configDefinedAt = getConfigDefinedAt('Config', 'prerender', configValue.definedAtData)
  assertUsage(
    typeof value === 'boolean',
    `${configDefinedAt} must be a boolean (or a function that returns a boolean) because it's defined as a page setting (not as a global setting)`,
  )
  const prerenderConfigLocal = { value }
  return prerenderConfigLocal
}

function isObject2<T extends Record<string, unknown>>(value: T | boolean | undefined): value is T {
  return typeof value === 'object' && value !== null
}
function pickFirst<T>(arr: T[]): T | undefined {
  return arr.filter((v) => v !== undefined)[0]
}
