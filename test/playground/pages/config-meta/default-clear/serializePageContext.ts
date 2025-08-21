import { serializePageContext as serializePageContextGeneric } from '../serializePageContext'
import type { PageContext } from 'vike/types'

export function serializePageContext(pageContext: PageContext) {
  return serializePageContextGeneric(pageContext, ['settingCumulativeString'])
}
