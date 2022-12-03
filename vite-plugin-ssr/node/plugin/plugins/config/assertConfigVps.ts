export { getConfigVps }
export { checkConfigVps }

import { assert, hasProp, isObject } from '../../utils'
import type { ConfigVpsResolved } from './ConfigVps'

function checkConfigVps(configVps: unknown): null | { prop: string; errMsg: `should be a${string}` } {
  assert(isObject(configVps))
  {
    const prop = 'disableAutoFullBuild'
    if (!hasProp(configVps, prop, 'boolean') && !hasProp(configVps, prop, 'undefined'))
      return { prop, errMsg: 'should be a boolean' }
  }
  {
    const prop = 'includeAssetsImportedByServer'
    if (!hasProp(configVps, prop, 'boolean') && !hasProp(configVps, prop, 'undefined'))
      return { prop, errMsg: 'should be a boolean' }
  }
  {
    const prop = 'prerender'
    if (
      !hasProp(configVps, prop, 'object') &&
      !hasProp(configVps, prop, 'boolean') &&
      !hasProp(configVps, prop, 'undefined')
    )
      return { prop, errMsg: 'should be an object or a boolean' }
  }

  const configVpsPrerender = configVps.prerender
  if (typeof configVpsPrerender === 'object') {
    {
      const p = 'partial'
      if (!hasProp(configVpsPrerender, p, 'boolean') && !hasProp(configVpsPrerender, p, 'undefined'))
        return { prop: `prerender.${p}`, errMsg: 'should be a boolean' }
    }
    {
      const p = 'noExtraDir'
      if (!hasProp(configVpsPrerender, p, 'boolean') && !hasProp(configVpsPrerender, p, 'undefined'))
        return { prop: `prerender.${p}`, errMsg: 'should be a boolean' }
    }
    {
      const p = 'disableAutoRun'
      if (!hasProp(configVpsPrerender, p, 'boolean') && !hasProp(configVpsPrerender, p, 'undefined'))
        return { prop: `prerender.${p}`, errMsg: 'should be a boolean' }
    }
    {
      const p = 'parallel'
      if (
        !hasProp(configVpsPrerender, p, 'boolean') &&
        !hasProp(configVpsPrerender, p, 'number') &&
        !hasProp(configVpsPrerender, p, 'undefined')
      )
        return { prop: `prerender.${p}`, errMsg: 'should be a boolean or a number' }
    }
  }

  return null
}

async function getConfigVps(config: Record<string, unknown>): Promise<ConfigVpsResolved> {
  const configVps: ConfigVpsResolved = (await config.configVpsPromise) as any
  return configVps
}
