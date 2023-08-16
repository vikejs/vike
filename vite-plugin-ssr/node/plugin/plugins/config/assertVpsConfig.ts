export { assertVpsConfig }

import { assert, assertUsage, hasProp, isObject } from '../../utils.js'
import type { ConfigVpsUserProvided } from '../../../../shared/ConfigVps.js'

type WrongUsage = { prop: string; errMsg: `should be a${string}` }

function assertVpsConfig(
  vikeConfig: unknown,
  wrongUsageMsg: (wrongUsage: WrongUsage) => string
): asserts vikeConfig is ConfigVpsUserProvided {
  const wrongUsageError = checkConfigVps(vikeConfig)
  if (wrongUsageError) {
    assertUsage(false, wrongUsageMsg(wrongUsageError))
  }
}

function checkConfigVps(configVps: unknown): null | WrongUsage {
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
