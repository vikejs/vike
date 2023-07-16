import { parse } from '@brillout/json-serializer/parse'
import { hasProp, objectAssign, assert, assertUsage } from './utils'

export { getPageContextSerializedInHtml }

function getPageContextSerializedInHtml(): {
  _pageId: string
  _pageContextRetrievedFromServer: Record<string, unknown>
  _comesDirectlyFromServer: true
} {
  const id = 'vite-plugin-ssr_pageContext'
  const elem = document.getElementById(id)
  assertUsage(
    elem,
    `The element #${id} (which vite-plugin-ssr automatically injects into the HTML) is missing from the DOM. This may happen if your HTML is malformed. Make sure your HTML isn't malformed, and make sure you don't remove #${id} from the HTML nor from the DOM.`
  )
  const pageContextJson = elem.textContent
  assert(pageContextJson)

  const parseResult = parse(pageContextJson)
  assert(hasProp(parseResult, 'pageContext', 'object'))
  const { pageContext } = parseResult
  assert(hasProp(pageContext, '_pageId', 'string'))

  objectAssign(pageContext, {
    _pageContextRetrievedFromServer: pageContext,
    _comesDirectlyFromServer: true as const
  })

  return pageContext
}
