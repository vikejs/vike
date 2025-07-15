import { PageContext } from 'vike/types'
import { serializePageContext as serializePageContextGeneric } from '../config-meta/serializePageContext'

export function serializePageContext(pageContext: PageContext) {
  return serializePageContextGeneric(pageContext, [
    'basicCumulative', 
    'defaultCumulative', 
    'noInheritCumulative', 
    'groupedCumulative'
  ])
}
