import { PageContext } from 'vike/types'
import { isBrowser } from '../../../utils/isBrowser'

export function serializeSettings(pageContext: PageContext) {
  return (
    '===CONFIG:START===' +
    JSON.stringify({
      isBrowser,
      standard: valueOrType(pageContext.config.settingStandard),
      cumulative: valueOrType(pageContext.config.settingCumulative)
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
