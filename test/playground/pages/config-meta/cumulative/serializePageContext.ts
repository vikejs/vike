import { PageContext } from 'vike/types'
import { serializePageContext as serializePageContextGeneric } from '../../../utils/serializePageContext'

export function serializePageContext(pageContext: PageContext) {
  return serializePageContextGeneric(pageContext, ['settingStandard', 'settingCumulative'])
}
