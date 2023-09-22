export { assertVikeConfig }

import { assert, assertUsage, hasProp, isObject } from '../../utils.js'
import type { ConfigVikeUserProvided } from '../../../../shared/ConfigVike.js'

type WrongUsage = { prop: string; errMsg: `should be a${string}` }

function assertVikeConfig(
  vikeConfig: unknown,
  wrongUsageMsg: (wrongUsage: WrongUsage) => string
): asserts vikeConfig is ConfigVikeUserProvided {
  const wrongUsageError = checkConfigVike(vikeConfig)
  if (wrongUsageError) {
    assertUsage(false, wrongUsageMsg(wrongUsageError))
  }
}

function checkConfigVike(configVike: unknown): null | WrongUsage {
  assert(isObject(configVike))
  {
    const prop = 'disableUrlNormalization'
    if (!hasProp(configVike, prop, 'boolean') && !hasProp(configVike, prop, 'undefined'))
      return { prop, errMsg: 'should be a boolean' }
  }
  {
    const prop = 'trailingSlash'
    if (!hasProp(configVike, prop, 'boolean') && !hasProp(configVike, prop, 'undefined'))
      return { prop, errMsg: 'should be a boolean' }
  }
  {
    const prop = 'redirects'
    const { redirects } = configVike
    if (
      !(
        redirects === undefined ||
        (isObject(redirects) && Object.values(redirects).every((v) => typeof v === 'string'))
      )
    )
      return { prop, errMsg: 'should be an object of strings' }
  }
  {
    const prop = 'disableAutoFullBuild'
    if (!hasProp(configVike, prop, 'boolean') && !hasProp(configVike, prop, 'undefined'))
      return { prop, errMsg: 'should be a boolean' }
  }
  {
    const prop = 'includeAssetsImportedByServer'
    if (!hasProp(configVike, prop, 'boolean') && !hasProp(configVike, prop, 'undefined'))
      return { prop, errMsg: 'should be a boolean' }
  }
  {
    const prop = 'prerender'
    if (
      !hasProp(configVike, prop, 'object') &&
      !hasProp(configVike, prop, 'boolean') &&
      !hasProp(configVike, prop, 'undefined')
    )
      return { prop, errMsg: 'should be an object or a boolean' }
  }

  const configVikePrerender = configVike.prerender
  if (typeof configVikePrerender === 'object') {
    {
      const p = 'partial'
      if (!hasProp(configVikePrerender, p, 'boolean') && !hasProp(configVikePrerender, p, 'undefined'))
        return { prop: `prerender.${p}`, errMsg: 'should be a boolean' }
    }
    {
      const p = 'noExtraDir'
      if (!hasProp(configVikePrerender, p, 'boolean') && !hasProp(configVikePrerender, p, 'undefined'))
        return { prop: `prerender.${p}`, errMsg: 'should be a boolean' }
    }
    {
      const p = 'disableAutoRun'
      if (!hasProp(configVikePrerender, p, 'boolean') && !hasProp(configVikePrerender, p, 'undefined'))
        return { prop: `prerender.${p}`, errMsg: 'should be a boolean' }
    }
    {
      const p = 'parallel'
      if (
        !hasProp(configVikePrerender, p, 'boolean') &&
        !hasProp(configVikePrerender, p, 'number') &&
        !hasProp(configVikePrerender, p, 'undefined')
      )
        return { prop: `prerender.${p}`, errMsg: 'should be a boolean or a number' }
    }
  }

  return null
}
