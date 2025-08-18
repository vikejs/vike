import { PageContext } from 'vike/types'
import { serializePageContext as serializePageContextGeneric } from '../serializePageContext'

export function serializePageContext(pageContext: PageContext) {
  return serializePageContextGeneric(pageContext, ['settingCumulativeString'])
}
