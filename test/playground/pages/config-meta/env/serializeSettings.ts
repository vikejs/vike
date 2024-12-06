import { PageContext } from 'vike/types'
import { isBrowser } from '../../isBrowser'

export function serializeSettings(pageContext: PageContext) {
  return (
    '===CONFIG:START===' +
    JSON.stringify({
      isBrowser,
      serverOnly: valueOrType(pageContext.config.settingServerOnly),
      clientOnly: valueOrType(pageContext.config.settingClientOnly),
      configOnly: valueOrType(pageContext.config.settingConfigOnly)
    }) +
    '===CONFIG:END==='
  )
}

export function valueOrType(value: any) {
  if (value === undefined) {
    return 'undefined'
  }
  if (value === null) {
    return 'null'
  }
  return value
}
