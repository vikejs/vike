import { PageContext } from 'vike/types'
import { serializeSettings as serializeSettingsGeneric } from '../../../utils/serializeSettings'

export function serializeSettings(pageContext: PageContext) {
  return serializeSettingsGeneric(pageContext, ['settingWithEffect', 'dependentSetting'])
}
